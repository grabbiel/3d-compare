import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.APP_URL ?? 'http://127.0.0.1:43123'
const artifactDir = process.env.ARTIFACT_DIR ?? '/tmp/3d-compare-verification'
const executablePath = process.env.CHROME_BIN ?? '/usr/local/bin/google-chrome'

await mkdir(artifactDir, { recursive: true })

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--enable-webgl',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--disable-dev-shm-usage',
  ],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })
const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') {
    errors.push(`console: ${message.text()}`)
  }
})
page.on('pageerror', (error) => errors.push(`page: ${error.message}`))

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await page.locator('.scene-empty').waitFor({ state: 'visible', timeout: 20_000 })
  assert.equal(await page.locator('#compare-stage canvas').count(), 1)
  assert.match(await page.locator('.stage-title strong').innerText(), /Concrete studio/)
  assert.equal(await page.locator('.nav-toggle button').first().getAttribute('aria-pressed'), 'true')

  await page.getByRole('button', { name: 'Add Ari', exact: true }).click()
  await page.locator('.inspector-heading h2').waitFor({ state: 'visible' })
  assert.equal(await page.locator('.inspector-heading h2').innerText(), 'Ari')

  await page.getByRole('button', { name: 'cm', exact: true }).click()
  await page.locator('.inspector-panel input[type="number"]').fill('190')
  await page.getByRole('button', { name: 'Update height', exact: true }).click()
  assert.equal(await page.locator('.selection-summary strong').innerText(), '190 cm')

  const firstCatalogCard = page.locator('.catalog-card').first()
  for (let index = 0; index < 9; index += 1) {
    await firstCatalogCard.click()
  }
  assert.equal(await page.locator('.lineup-list li').count(), 10)
  assert.match(await page.locator('.cap-message').innerText(), /Stage full/)
  assert.equal(await firstCatalogCard.isDisabled(), true)

  await page.getByRole('button', { name: 'Walk', exact: true }).click()
  assert.match(await page.locator('.navigation-hint').innerText(), /W A S D/)

  const heightScreenshot = await page.screenshot({
    path: `${artifactDir}/height-desktop.png`,
    fullPage: true,
  })
  assert.ok(heightScreenshot.byteLength > 30_000)

  await page.locator('.mode-switch button').nth(1).click()
  await page.locator('.mode-feet').waitFor({ state: 'visible' })
  assert.match(await page.locator('.stage-title strong').innerText(), /Oak measure table/)
  await page.getByRole('button', { name: 'Add female foot', exact: true }).click()
  assert.equal(await page.locator('.lineup-list li').count(), 1)

  await page.getByRole('button', { name: 'EU', exact: true }).click()
  await page.locator('.shoe-field select').selectOption('40')
  assert.equal(await page.locator('.selection-summary strong').innerText(), 'EU 40')
  assert.match(await page.locator('.selection-summary small').innerText(), /257 mm/)

  await page.locator('.feet-catalog .catalog-card').nth(1).click()
  assert.equal(await page.locator('.lineup-list li').count(), 2)
  await page.getByRole('button', { name: 'Inspect', exact: true }).click()
  assert.match(await page.locator('.navigation-hint').innerText(), /Drag to pan/)

  const feetScreenshot = await page.screenshot({
    path: `${artifactDir}/feet-desktop.png`,
    fullPage: true,
  })
  assert.ok(feetScreenshot.byteLength > 30_000)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload({ waitUntil: 'networkidle' })
  await page.locator('#compare-stage canvas').waitFor({ state: 'visible', timeout: 20_000 })
  assert.equal(await page.locator('.lineup-list li').count(), 2)
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  assert.ok(scrollWidth <= 390, `Mobile layout overflows to ${scrollWidth}px.`)
  await page.screenshot({
    path: `${artifactDir}/feet-mobile.png`,
    fullPage: true,
  })

  await page.locator('.mode-switch button').first().click()
  assert.equal(await page.locator('.lineup-list li').count(), 10)
  assert.match(await page.locator('.cap-message').innerText(), /Stage full/)
  assert.deepEqual(errors, [])

  console.log(`UI verification passed. Screenshots: ${artifactDir}`)
} finally {
  await browser.close()
}
