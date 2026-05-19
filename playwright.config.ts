import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3211',
    trace: 'on-first-retry',
  },
  webServer: {
    command: "NEXT_PUBLIC_API_HOST='https://explorer.heima.network' npm run dev -- --hostname 127.0.0.1 --port 3211",
    url: 'http://127.0.0.1:3211',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
