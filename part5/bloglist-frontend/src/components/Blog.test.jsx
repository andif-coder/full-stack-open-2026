import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

describe('<Blog />', () => {
	const blogs = [
		{
			author: 'andwho',
			id: '6a9a6cd37a3c9750c6ee8ac8',
			likes: 82,
			title: 'ABC',
			url: 'www.abc.com',
			user: {
				id: '6a994028013615ff694c3771',
				name: 'andwho',
				username: 'cwj'
			}
		}
	]
	const creatorUser = {
		username: 'cwj',
		name: 'andwho'
	}
	const otherUser = {
		username: 'lxy',
		name: 'andand'
	}
	test('render title & author & url & number of likes', () => {
		render(
			<MemoryRouter initialEntries={[`/blogs/${blogs[0].id}`]}>
				<Routes>
					<Route path="/blogs/:id" element={<Blog blogs={blogs} />} />
				</Routes>
			</MemoryRouter>
		)
		const heading = screen.getByRole('heading', { level: 2, name: `${blogs[0].author}: ${blogs[0].title}` })
		expect(heading).toBeVisible()
		expect(screen.getByText(blogs[0].url)).toBeVisible()
		expect(screen.getByText(`likes ${blogs[0].likes}`)).toBeVisible()
		const likeButton = screen.queryByRole('button', { name: 'like' })
		expect(likeButton).toBeNull()
		const removeButton = screen.queryByRole('button', { name: 'remove' })
		expect(removeButton).toBeNull()
	})
	test('authenticated non-creator sees only like button', () => {
		render(
			<MemoryRouter initialEntries={[`/blogs/${blogs[0].id}`]}>
				<Routes>
					<Route path="/blogs/:id" element={<Blog blogs={blogs} user={otherUser} />} />
				</Routes>
			</MemoryRouter>
		)
		const heading = screen.getByRole('heading', { level: 2, name: `${blogs[0].author}: ${blogs[0].title}` })
		expect(heading).toBeVisible()
		expect(screen.getByText(blogs[0].url)).toBeVisible()
		expect(screen.getByText(`likes ${blogs[0].likes}`)).toBeVisible()
		expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
		const removeButton = screen.queryByRole('button', { name: 'remove' })
		expect(removeButton).toBeNull()
	})
	test('creator sees all', () => {
		render(
			<MemoryRouter initialEntries={[`/blogs/${blogs[0].id}`]}>
				<Routes>
					<Route path="/blogs/:id" element={<Blog blogs={blogs} user={creatorUser} />} />
				</Routes>
			</MemoryRouter>
		)
		const heading = screen.getByRole('heading', { level: 2, name: `${blogs[0].author}: ${blogs[0].title}` })
		expect(heading).toBeVisible()
		expect(screen.getByText(blogs[0].url)).toBeVisible()
		expect(screen.getByText(`likes ${blogs[0].likes}`)).toBeVisible()
		expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
		expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
	})
})
