import { Link } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
export const LoginForm = ({ handleLogin, msg, setUsername, username, setPassword, password }) => {
  return (
    <form onSubmit={handleLogin}>
    	<h2>log in to application</h2>
      <div>
				<TextField
					variant="standard"
					label="username"
					value={username}
					onChange={({ target }) => setUsername(target.value)}
				/>
      </div>
      <div>
				<TextField
					variant="standard"
					label="password"
					type="password"
					value={password}
					onChange={({ target }) => setPassword(target.value)}
				/>
      </div>
			<Button type="submit" variant="contained" style={{marginTop: 10}}>login</Button>
    </form>
  )
}
export const BlogForm = ({ msg, user, blogs}) => {
  return (
    <div>
      <h2>blogs</h2>
			{ user ? <p>{user.name} logged in</p> : false }
      <ul>
				{[...blogs].sort((a, b) => { return b.likes - a.likes }).map(blog =>
					<li key={blog.id}>
						<Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
					</li>
				)}
			</ul>
    </div>
  )
}
