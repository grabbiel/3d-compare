import { chromium } from 'playwright-core'

const launchArgs = [
  '--no-sandbox',
  '--enable-webgl',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--disable-dev-shm-usage',
]

// CHROME_BIN points at a specific Chrome or Chromium binary. Without it,
// Playwright's "chrome" channel locates the system Google Chrome on macOS,
// Windows, and Linux, so the scripts no longer assume a Linux install path.
export async function launchChrome() {
  const executablePath = process.env.CHROME_BIN
  try {
    return await chromium.launch({
      ...(executablePath ? { executablePath } : { channel: 'chrome' }),
      headless: true,
      args: launchArgs,
    })
  } catch (error) {
    const hint = executablePath
      ? `Could not launch the browser at CHROME_BIN=${executablePath}.`
      : 'Could not find a system Google Chrome. Set CHROME_BIN to a Chrome or Chromium binary.'
    throw new Error(`${hint}\n${error instanceof Error ? error.message : String(error)}`)
  }
}
