import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import CreateBlog from './createBlog'

describe('<CreateBlog />', () => {
	test('create blog', async () => {
		const handleCreate = vi.fn()
		render(<CreateBlog handleCreate={handleCreate} />)
		const input = screen.getAllByRole('textbox')
		const button = screen.getByRole('button')
		// screen.debug(input)
		const user = userEvent.setup()
		await user.type(input[0], 'title for testing')
		await user.type(input[1], 'author for testing')
		await user.type(input[2], 'url for testing')
		await user.click(button)
		expect(handleCreate.mock.calls).toHaveLength(1)
		expect(handleCreate).toHaveBeenCalledWith({
			title: 'title for testing',
			author: 'author for testing',
			url: 'url for testing'
		})
	})
})

