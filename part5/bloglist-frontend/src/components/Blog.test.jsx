import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
		expect(div).toHaveTextContent('www.abc.com')
		expect(div).toHaveTextContent('likes 90')
		expect(div).not.toBeVisible()
	})
	test('change hidden to show', async () => {
		const { container } = render(<Blog blog={blog} />)
		const showDiv = container.querySelector('.blog-show')
		const hiddenDiv = container.querySelector('.blog-hidden')
		const user = userEvent.setup()
		const button = hiddenDiv.querySelector('button')
		await user.click(button)
		expect(showDiv).toHaveTextContent('www.abc.com')
		expect(showDiv).toHaveTextContent('likes 90')
		expect(showDiv).toBeVisible()
	})
})
