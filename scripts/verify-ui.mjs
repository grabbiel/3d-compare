import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { launchChrome } from './browser.mjs'

const baseUrl = process.env.APP_URL ?? 'http://127.0.0.1:43123'
const artifactDir = process.env.ARTIFACT_DIR ?? '/tmp/3d-compare-verification'

await mkdir(artifactDir, { recursive: true })

async function captureWebGlFrame(page, filename) {
  const frame = await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          const canvas = document.querySelector('#compare-stage canvas')
          const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
          const pixels = new Uint8Array(canvas.width * canvas.height * 4)
          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
          let minimum = 765
          let maximum = 0
          let samples = 0
          for (let index = 0; index < pixels.length; index += 64) {
            const sum = pixels[index] + pixels[index + 1] + pixels[index + 2]
            minimum = Math.min(minimum, sum)
            maximum = Math.max(maximum, sum)
            samples += 1
          }
          resolve({
            dataUrl: canvas.toDataURL('image/png'),
            contrast: maximum - minimum,
            samples,
          })
        })
      }),
  )
  assert.ok(frame.samples > 1000)
  assert.ok(frame.contrast > 100, `WebGL frame contrast was only ${frame.contrast}.`)
  await writeFile(`${artifactDir}/${filename}`, Buffer.from(frame.dataUrl.split(',')[1], 'base64'))
}

const browser = await launchChrome()

const page = await browser.newPage({ viewport: { width: 1440, height: 960 } })
const errors = []

// The Google Fonts stylesheet is optional: the app falls back to system fonts
// when it does not load, so an offline or sandboxed run must not fail on it.
const optionalFontHosts = new Set(['fonts.googleapis.com', 'fonts.gstatic.com'])

function isOptionalFontFailure(message) {
  const url = message.location().url
  if (!url) {
    return false
  }
  try {
    return optionalFontHosts.has(new URL(url).hostname)
  } catch {
    return false
  }
}

page.on('console', (message) => {
  if (message.type() === 'error' && !isOptionalFontFailure(message)) {
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

  // Scene labels mount only after each textured model has loaded.
  await page.locator('.scene-label').nth(9).waitFor({ state: 'attached', timeout: 60_000 })

  await page.getByRole('button', { name: 'Walk', exact: true }).click()
  assert.match(await page.locator('.navigation-hint').innerText(), /W A S D/)

  const heightScreenshot = await page.screenshot({
    path: `${artifactDir}/height-desktop.png`,
    fullPage: true,
  })
  assert.ok(heightScreenshot.byteLength > 30_000)
  await captureWebGlFrame(page, 'height-webgl.png')

  await page.locator('.mode-switch button').nth(1).evaluate((button) => button.click())
  await page.locator('.mode-feet').waitFor({ state: 'visible' })
  assert.match(await page.locator('.stage-title strong').innerText(), /Oak measure table/)
  await page
    .getByRole('button', { name: 'Add female feet', exact: true })
    .evaluate((button) => button.click())
  assert.equal(await page.locator('.lineup-list li').count(), 1)

  await page.getByRole('button', { name: 'EU', exact: true }).evaluate((button) => button.click())
  await page.locator('.shoe-field select').selectOption('40')
  assert.equal(await page.locator('.selection-summary strong').innerText(), 'EU 40')
  assert.match(await page.locator('.selection-summary small').innerText(), /257 mm/)

  await page.locator('.feet-catalog .catalog-card').nth(1).evaluate((button) => button.click())
  assert.equal(await page.locator('.lineup-list li').count(), 2)
  await page
    .getByRole('button', { name: 'Inspect', exact: true })
    .evaluate((button) => button.click())
  assert.match(await page.locator('.navigation-hint').innerText(), /Drag to pan/)
  await page.locator('.scene-label').nth(1).waitFor({ state: 'attached', timeout: 60_000 })

  const feetScreenshot = await page.screenshot({
    path: `${artifactDir}/feet-desktop.png`,
    fullPage: true,
  })
  assert.ok(feetScreenshot.byteLength > 30_000)
  await captureWebGlFrame(page, 'feet-webgl.png')

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

  await page.locator('.mode-switch button').first().evaluate((button) => button.click())
  assert.equal(await page.locator('.lineup-list li').count(), 10)
  assert.match(await page.locator('.cap-message').innerText(), /Stage full/)
  assert.deepEqual(errors, [])

  console.log(`UI verification passed. Screenshots: ${artifactDir}`)
} finally {
  await browser.close()
}
