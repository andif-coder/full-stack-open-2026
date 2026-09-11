import { Link } from 'react-router-dom'
export const LoginForm = ({ handleLogin, msg, setUsername, username, setPassword, password }) => {
  return (
    <form onSubmit={handleLogin}>
    	<h2>log in to application</h2>
      <div>
        <label>
					username:
          <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </label>
      </div>
      <div>
        <label>
					password:
          <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </label>
      </div>
      <button type="submit">login</button>
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
