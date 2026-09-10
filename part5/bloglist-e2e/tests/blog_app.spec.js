import { test, describe, expect, beforeEach } from '@playwright/test'

describe('Blog app', () => {
	beforeEach(async ({ page, request }) => {
		await request.post('http://localhost:3003/api/testing/reset')
		await request.post('http://localhost:3003/api/users', {
			data: {
				username: 'cwj',
				name: 'andwho',
				password: '123456'
			}
		})
		await page.goto('')
	})
	test('Login form is shown', async ({ page }) => {
		const user_label = page.getByLabel('username:')
		const password_label = page.getByLabel('password:')
		const login_button = page.getByRole('button', { name: 'login' })
		await expect(user_label).toBeVisible()
		await expect(password_label).toBeVisible()
		await expect(login_button).toBeVisible()
	})
	describe('Login', () => {
		test('succeeds with correct credentials', async ({ page }) => {
			const user_label = page.getByLabel('username:')
			const password_label = page.getByLabel('password:')
			const login_button = page.getByRole('button', { name: 'login' })
			await user_label.fill('cwj')
			await password_label.fill('123456')
			await login_button.click()
			await expect(page.getByText('andwho logged in')).toBeVisible()
		})
		test('fails with wrong credentials', async ({ page }) => {
			const user_label = page.getByLabel('username:')
			const password_label = page.getByLabel('password:')
			const login_button = page.getByRole('button', { name: 'login' })
			await user_label.fill('cwj')
			await password_label.fill('123123')
			await login_button.click()
			await expect(page.getByText('wrong username or password')).toBeVisible()
			await expect(page.getByText('andwho logged in')).not.toBeVisible()
		})
	})
	describe('When logged in', () => {
		beforeEach(async ({ page }) => {
			const user_label = page.getByLabel('username:')
			const password_label = page.getByLabel('password:')
			const login_button = page.getByRole('button', { name: 'login' })
			await user_label.fill('cwj')
			await password_label.fill('123456')
			await login_button.click()
		})
		test('a new blog can be created', async({ page }) => {
			await page.getByRole('button', { name: 'create new blog' }).click()
			const title_label = page.getByLabel('title:')
			const author_label = page.getByLabel('author:')
			const url_label = page.getByLabel('url:')
			await title_label.fill('title for testing')
			await author_label.fill('andwho')
			await url_label.fill('www.testing.com')
			await page.getByRole('button', { name: 'create' }).click()
			await expect(page.getByText('a new blog title for testing by andwho added')).toBeVisible()
			const blogDiv = page.locator('.blog-hidden')
			await expect(blogDiv).toContainText('title for testing andwho')
			await expect(blogDiv.getByRole('button', { name: 'view' })).toBeVisible()
		})
	})
})

