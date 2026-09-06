import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const baseUrl = process.env.APP_URL ?? 'http://127.0.0.1:43123'
const artifactDir = process.env.ARTIFACT_DIR ?? '/tmp/3d-compare-fix'
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

try {
  await page.addInitScript(() => localStorage.clear())
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Add Ari', exact: true }).click()
  await page.locator('.catalog-card').filter({ hasText: 'Luca' }).click()
  await page.locator('.scene-label').nth(1).waitFor({ state: 'visible' })
  await page.waitForTimeout(500)

  const screenshot = await page.locator('.canvas-shell').screenshot()
  const screenshotPath = `${artifactDir}/height-shell.png`
  await writeFile(screenshotPath, screenshot)

  const meanRgb = await page.evaluate(async (base64) => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()

    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) {
      throw new Error('Could not create a 2D context for screenshot analysis.')
    }
    context.drawImage(image, 0, 0)

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    let total = 0
    for (let index = 0; index < pixels.length; index += 4) {
      total += pixels[index] + pixels[index + 1] + pixels[index + 2]
    }
    return total / (pixels.length / 4) / 3
  }, screenshot.toString('base64'))

  assert.ok(meanRgb > 40, `Composited stage mean RGB was ${meanRgb.toFixed(2)}.`)
  console.log(`Rendering verification passed. Mean RGB: ${meanRgb.toFixed(2)}. Screenshot: ${screenshotPath}`)
} finally {
  await browser.close()
}
