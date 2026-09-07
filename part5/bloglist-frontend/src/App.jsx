import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

	useEffect(() => {
		const loggedUserJson = window.localStorage.getItem('loggedUser')
		if (loggedUserJson) {
			const userFromStorage = JSON.parse(loggedUserJson)
			setUser(userFromStorage)
		}
	}, [])
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
	const handleLogin = async event => {
		event.preventDefault()
		try {
			const user = await loginService.login({ username, password})
			window.localStorage.setItem('loggedUser', JSON.stringify(user))
			setUser(user)
			setUsername('')
			setPassword('')
		} catch {
			console.log('wrong username or password')
		}
	}
	const handleLogout = event => {
		window.localStorage.removeItem('loggedUser')
		setUser(null)
		setUsername('')
		setPassword('')
	}
	const loginForm = () => {
		return (
			<form onSubmit={handleLogin}>
	    	<h2>log in to application</h2>
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
				<p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      	{blogs.map(blog =>
      	  <Blog key={blog.id} blog={blog} />
      	)}
			</div>
		)
	}
  return (
    <div>
			{!user && loginForm()}
			{user && blogForm()}
    </div>
  )
}

export default App
