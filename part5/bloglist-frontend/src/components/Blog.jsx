import { useParams } from 'react-router-dom'
const Blog = ({ blogs, updateLikes, removeBlog, user }) => {
	const id = useParams().id
	const blog = blogs.find(b => b.id === id)
	if (!blog) return null
  const showRemove = user?.username === blog.user?.username
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
      <div><h2>{blog.author}: {blog.title}</h2></div>
      <div><a>{blog.url}</a></div>
      <div>likes {blog.likes} {user?<button type="button" onClick={addlikes}>like</button>:null}</div>
      <div>Added by {blog.user?.name}</div>
      <div>{showRemove && <button type="button" onClick={deleteBlog}>remove</button>}</div>
    </div>
  )
}

export default Blog
