import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const CreateBlog = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleCreateInner = (event) => {
    event.preventDefault()
    handleCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <form onSubmit={handleCreateInner}>
        <h2>create new</h2>
        <div>
					<TextField
						label="title"
						margin="dense"
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
        </div>
        <div>
					<TextField
						label="author"
						margin="dense"
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
        </div>
        <div>
					<TextField
						label="url"
						margin="dense"
						value={url}
						onChange={({ target }) => setUrl(target.value)}
					/>
        </div>
				<Button type="submit" variant="contained" style={{marginTop: 10}}>create</Button>
      </form>
    </div>
  )
}
export default CreateBlog
