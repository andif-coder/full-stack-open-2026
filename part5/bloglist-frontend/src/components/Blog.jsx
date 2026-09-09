import { useState } from 'react'
const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [isShow, setIsShow] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const noneStyle = { display: 'none' }
  const showStyle = isShow ? blogStyle : noneStyle
  const hiddenStyle = !isShow ? blogStyle : noneStyle
  // console.log('cwj username: ', user.username, ' blog.user.username: ', blog.user.username)
  const showRemove = user?.username === blog.user?.username
  const handleShow = () => {
    setIsShow(!isShow)
  }
  const addlikes = async () => {
    const updateBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user
    }
    updateLikes(updateBlog)
  }
  const deleteBlog = async () => {
    const check = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (check) removeBlog(blog)
  }
  return (
    <div>
      <div style={hiddenStyle} className='blog-hidden'>
        {blog.title} {blog.author} <button type="button" onClick={handleShow}> {isShow ? 'hide' : 'view' }</button>
      </div>
      <div style={showStyle} className='blog-show'>
        <div>{blog.title} {blog.author} <button type="button" onClick={handleShow}> {isShow ? 'hide' : 'view' }</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button type="button" onClick={addlikes}>like</button></div>
        <div>{blog.user?.name}</div>
        <div>{showRemove && <button type="button" onClick={deleteBlog}>remove</button>}</div>
      </div>
    </div>
  )
}

export default Blog
