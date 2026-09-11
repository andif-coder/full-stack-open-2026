import { test, describe, expect, beforeEach } from '@playwright/test'
import { log } from 'console'

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
	const createBlog = async (page, title, author, url) => {
		await page.getByRole('button', { name: 'create new blog' }).click()
		await page.getByLabel('title:').fill(title)
		await page.getByLabel('author:').fill(author)
		await page.getByLabel('url:').fill(url)
		await page.getByRole('button', { name: 'create' }).click()
		await expect(page.locator('.blog-hidden', { hasText: title })).toBeVisible()
	}
	describe('When logged in', () => {
		beforeEach(async ({ page }) => {
			const user_label = page.getByLabel('username:')
			const password_label = page.getByLabel('password:')
			const login_button = page.getByRole('button', { name: 'login' })
			await user_label.fill('cwj')
			await password_label.fill('123456')
			await login_button.click()
		})
		describe('When a blog exist', () => {
			beforeEach(async ({ page }) => {
				await createBlog(page, 'title for testing', 'andwho', 'www.testing.com')
			})
			test('a new blog can be created', async ({ page }) => {
				await expect(page.getByText('a new blog title for testing by andwho added')).toBeVisible()
				const blogDiv = page.locator('.blog-hidden')
				await expect(blogDiv).toContainText('title for testing andwho')
				await expect(blogDiv.getByRole('button', { name: 'view' })).toBeVisible()
			})
			test('add like', async ({ page }) => {
				const blogDiv = page.locator('.blog-hidden')
				const viewButton = blogDiv.getByRole('button', { name: 'view' })
				await viewButton.click()
				const likesDiv = page.getByText('likes 0')
				const likeButton = likesDiv.getByRole('button', { name: 'like' })
				await likeButton.click()
				await expect(page.getByText('likes 1')).toBeVisible()
			})
			test('delete blog', async ({ page }) => {
				const blogDiv = page.locator('.blog-hidden')
				const viewButton = blogDiv.getByRole('button', { name: 'view' })
				await viewButton.click()
				const removeButton = page.getByRole('button', { name: 'remove' })
				page.once('dialog', async dialog => {
					await dialog.accept()
				})
				await removeButton.click()
				await expect(page.getByText('title for testing andwho')).toHaveCount(0)
			})
			test('remove button visibility', async ({ page, request }) => {
				await request.post('http://localhost:3003/api/users', {
					data: {
						username: 'lxy',
						name: 'andand',
						password: '123456'
					}
				})
				const blogDiv = page.locator('.blog-hidden')
				const viewButton = blogDiv.getByRole('button', { name: 'view' })
				await viewButton.click()
				await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
				const logout_button = page.getByRole('button', { name: 'logout' })
				await logout_button.click()
				const user_label = page.getByLabel('username:')
				const password_label = page.getByLabel('password:')
				const login_button = page.getByRole('button', { name: 'login' })
				await user_label.fill('lxy')
				await password_label.fill('123456')
				await login_button.click()
				await expect(page.getByText('andand logged in')).toBeVisible()
				const newViewButton = page.locator('.blog-hidden').getByRole('button', { name: 'view' })
				await newViewButton.click()
				await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
			})
		})
		describe('When blogs exist', () => {
			beforeEach(async ({ page }) => {
				await createBlog(page, 'title1 for testing', 'andwho', 'www.testing.com')
				await createBlog(page, 'title2 for testing', 'andwho', 'www.testing.com')
				await createBlog(page, 'title3 for testing', 'andwho', 'www.testing.com')
			})
			test('blog is sorted by likes', async ({ page }) => {
				const viewButtons = page.locator('.blog-hidden').getByRole('button', { name: 'view' })
				while(await viewButtons.count() > 0) {
					await viewButtons.first().click()
				}
				await expect(page.getByText(/likes \d+/)).toHaveCount(3)
				const likesTexts = await page.getByText(/likes \d+/).allInnerTexts()
				const likesNumbers = likesTexts.map(text => {
					const match = text.match(/\d+/)
					return match ? Number(match[0]) : 0
				})
				expect(likesNumbers).toEqual([...likesNumbers].sort((a, b) => b - a))
				const title3 = page.locator('.blog-show', { hasText: 'title3' })
				await title3.getByRole('button', { name: 'like' }).click()
				await expect(title3.getByText('likes 1')).toBeVisible()
				await title3.getByRole('button', { name: 'like' }).click()
				await expect(title3.getByText('likes 2')).toBeVisible()
				await title3.getByRole('button', { name: 'like' }).click()
				await expect(title3.getByText('likes 3')).toBeVisible()
				const title2 = page.locator('.blog-show', { hasText: 'title2' })
				await title2.getByRole('button', { name: 'like' }).click()
				await expect(title2.getByText('likes 1')).toBeVisible()
				await title2.getByRole('button', { name: 'like' }).click()
				await expect(title2.getByText('likes 2')).toBeVisible()
				const title1 = page.locator('.blog-show', { hasText: 'title1' })
				await title1.getByRole('button', { name: 'like' }).click()
				await expect(title1.getByText('likes 1')).toBeVisible()
				await expect(page.locator('.blog-show').first()).toContainText('title3')
				const likesTextsNew = await page.getByText(/likes \d+/).allInnerTexts()
				const likesNumbersNew = likesTextsNew.map(text => {
					const match = text.match(/\d+/)
					return match ? Number(match[0]) : 0
				})
				expect(likesNumbersNew).toEqual([...likesNumbersNew].sort((a, b) => b - a))
			})
		})
	})
})

