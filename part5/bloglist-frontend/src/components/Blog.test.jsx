import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

describe('<Blog />', () => {
	const blog = {
		author: 'andwho',
		id: '6a9a6cd37a3c9750c6ee8ac8',
		likes: 90,
		title: 'ABC',
		url: 'www.abc.com',
		user: {
			id: '6a994028013615ff694c3771',
			name: 'andwho',
			username: 'cwj'
		}
	}
	test('render title & author', () => {
		const { container } = render(<Blog blog={blog} />)
		const div = container.querySelector('.blog-hidden')
		expect(div).toHaveTextContent('ABC')
		expect(div).toHaveTextContent('andwho')
		expect(div).toBeVisible()
	})
	test('do not render url & number of likes', () => {
		const { container } = render(<Blog blog={blog} />)
		const div = container.querySelector('.blog-show')
		expect(div).not.toBeVisible()
	})
})
