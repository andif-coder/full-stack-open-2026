import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { LoginForm, BlogForm } from './components/Form'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import CreateBlog from './components/createBlog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const userFromStorage = JSON.parse(loggedUserJson)
      blogService.setToken(userFromStorage.token)
			return userFromStorage
    }
		return null
	})
  const [msg, setMsg] = useState(null)
	const navigate = useNavigate()

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
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
			navigate('/')
    } catch {
      setNewMsg({ type: 'error', content: 'wrong username or password' })
      console.log('wrong username or password')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)
    setUsername('')
    setPassword('')
		navigate('/')
  }
  const handleCreate = async (data) => {
    try {
      const savedBlog = await blogService.create({ title: data.title, author: data.author, url: data.url })
      setBlogs(blogs.concat(savedBlog))
      setNewMsg({ type: 'success', content: `a new blog ${data.title} by ${data.author} added` })
			navigate('/')
      console.log('cwj savedblog: ', savedBlog)
    } catch {
      console.log('create new failed')
    }
  }
  const updateLikes = async (updateBlog) => {
    const updatedBlog = await blogService.update(updateBlog)
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
  }
  const removeBlog = async (removeBlog) => {
    await blogService.remove(removeBlog)
    setBlogs(blogs.filter(b => b.id !== removeBlog.id))
		navigate('/')
  }
  return (
    <div>
			<div>
				<Link to="/">blogs</Link>
				{user ?
					<Link to="/create">new blog</Link> :
					null
				}
				{user ? 
					<button onClick={handleLogout}>logout</button> :
					<Link to="/login">login</Link>
				}
			</div>
      <Notification msg={msg} />
			<Routes>
				<Route path="/" element={<BlogForm msg={msg} user={user} blogs={blogs}/>} />
				<Route path="/login" element={<LoginForm handleLogin={handleLogin} msg={msg} setUsername={setUsername} username={username} setPassword={setPassword} password={password}/>} />
				<Route path="/blogs/:id" element={<Blog blogs={blogs} updateLikes={updateLikes} removeBlog={removeBlog} user={user}/>} />
				<Route path="/create" element={user ? <CreateBlog handleCreate={handleCreate} /> : <Navigate replace to="/login" />} />
			</Routes>
    </div>
  )
}

export default App
