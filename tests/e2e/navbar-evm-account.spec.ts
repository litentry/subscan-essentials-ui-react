import { expect, test } from '@playwright/test'

const evmAccount = '0xdE644936D5B7d5d42032fd08bbA42Fbbfd6663Bc'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/scan/metadata', async (route) => {
    await route.fulfill({
      json: {
        code: 0,
        message: 'Success',
        generated_at: 0,
        data: {
          addressType: 'account',
          balanceAccuracy: '0.0001',
          count_extrinsic: '1',
          count_signed_extrinsic: '1',
          enable_substrate: true,
          enable_evm: true,
          finalized_blockNum: '1',
          networkNode: 'heima',
          total_account: '1',
          total_evm_account: '1',
          total_evm_contract: '1',
          total_transaction: '1',
          total_transfer: '1',
        },
      },
    })
  })

  await page.route('**/api/scan/token', async (route) => {
    await route.fulfill({
      json: {
        code: 0,
        message: 'Success',
        generated_at: 0,
        data: {
          token_id: 'HEI',
          decimals: 18,
          symbol: 'HEI',
        },
      },
    })
  })

  await page.route('**/api/plugin/evm/accounts', async (route) => {
    await route.fulfill({
      json: {
        code: 0,
        message: 'Success',
        generated_at: 0,
        data: {
          list: [
            {
              evm_account: evmAccount,
              balance: '0',
              count_transaction: '0',
            },
          ],
          count: 1,
          pagination: {
            start_cursor: 0,
            end_cursor: 0,
            has_next_page: false,
            has_previous_page: false,
          },
        },
      },
    })
  })

  await page.route('**/api/plugin/evm/account/tokens', async (route) => {
    await route.fulfill({
      json: {
        code: 0,
        message: 'Success',
        generated_at: 0,
        data: [],
      },
    })
  })

  await page.route('**/api/plugin/evm/transactions', async (route) => {
    await route.fulfill({
      json: {
        code: 0,
        message: 'Success',
        generated_at: 0,
        data: {
          list: [],
          count: 0,
          pagination: {
            start_cursor: 0,
            end_cursor: 0,
            has_next_page: false,
            has_previous_page: false,
          },
        },
      },
    })
  })

  await page.route('**/api/plugin/evm/token/transfer', async (route) => {
    await route.fulfill({
      json: {
        code: 0,
        message: 'Success',
        generated_at: 0,
        data: {
          list: [],
          count: 0,
          pagination: {
            start_cursor: 0,
            end_cursor: 0,
            has_next_page: false,
            has_previous_page: false,
          },
        },
      },
    })
  })
})

test('search bar exposes EVM Account and opens the requested EVM account', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /Substrate Block.*Search type/ }).click()

  const evmAccountOption = page.getByRole('option', { name: 'EVM Account' })
  await expect(evmAccountOption).toBeVisible()
  await evmAccountOption.click()

  await page.getByPlaceholder('Search').fill(evmAccount)
  await page.getByPlaceholder('Search').press('Enter')

  await expect(page).toHaveURL(`/address/${evmAccount}`)
  await expect(page.getByText(`#${evmAccount}`)).toBeVisible()

  await page.screenshot({ path: 'test-results/evm-account-search-final.png', fullPage: true })
})
