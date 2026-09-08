import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/toggle'
import CreateBlog from './components/createBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [msg, setMsg] = useState(null)
	const createBlogFormRef = useRef()

	useEffect(() => {
		const loggedUserJson = window.localStorage.getItem('loggedUser')
		if (loggedUserJson) {
			const userFromStorage = JSON.parse(loggedUserJson)
			setUser(userFromStorage)
			blogService.setToken(userFromStorage.token)
		}
	}, [])
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
	const setNewMsg = ({ type, content }) => {
		setMsg({ type: type, content: content })
		setTimeout(() => {
			setMsg(null)
		}, 5000)
	}
	const handleLogin = async event => {
		event.preventDefault()
		try {
			const user = await loginService.login({ username, password})
			window.localStorage.setItem('loggedUser', JSON.stringify(user))
			blogService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch {
			setNewMsg({ type: 'error', content: 'wrong username or password' })
			console.log('wrong username or password')
		}
	}
	const handleLogout = _event => {
		window.localStorage.removeItem('loggedUser')
		blogService.setToken(null)
		setUser(null)
		setUsername('')
		setPassword('')
	}
	const handleCreate = async (data) => {
		try {
			const savedBlog = await blogService.create({ title: data.title, author: data.author, url: data.url })
			setBlogs(blogs.concat(savedBlog))
			setNewMsg({ type: 'success', content: `a new blog ${data.title} by ${data.author} added` })
			createBlogFormRef.current.toggleVisibility()
			console.log('cwj savedblog: ', savedBlog)
		} catch {
			console.log('create new failed')
		}
	}
	const updateLikes = async (updatedBlog) => {
		setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
	}
	const loginForm = () => {
		return (
			<form onSubmit={handleLogin}>
	    	<h2>log in to application</h2>
				<Notification msg={msg} />
				<div>
					<label>
						username: 
						<input type="text" value={username} onChange={({target}) => setUsername(target.value)} />
					</label>
				</div>
				<div>
					<label>
						password: 
						<input type="password" value={password} onChange={({target}) => setPassword(target.value)} />
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		)
	}
	const blogForm = () => {
		return (
			<div>
			<h2>blogs</h2>
			<Notification msg={msg} />
			<p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
			<Togglable buttonLabel="create new blog" ref={createBlogFormRef}>
				<CreateBlog handleCreate={handleCreate} />
			</Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
      )}
			</div>
		)
	}
	console.log(blogs)
  return (
    <div>
			{!user && loginForm()}
			{user && blogForm()}
    </div>
  )
}

export default App
