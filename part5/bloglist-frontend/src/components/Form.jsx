import Notification from './Notification'
import { Link } from 'react-router-dom'
import Togglable from './toggle'
import CreateBlog from './createBlog'
export const LoginForm = ({ handleLogin, msg, setUsername, username, setPassword, password }) => {
  return (
    <form onSubmit={handleLogin}>
    	<h2>log in to application</h2>
      <Notification msg={msg} />
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
export const BlogForm = ({ msg, user, createBlogFormRef, handleCreate, blogs}) => {
  return (
    <div>
      <h2>blogs</h2>
      <Notification msg={msg} />
			{ user ? <p>{user.name} logged in</p> : false }
      <Togglable buttonLabel="create new blog" ref={createBlogFormRef}>
        <CreateBlog handleCreate={handleCreate} />
      </Togglable>
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
