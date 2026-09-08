import { useState } from "react"
import blogService from '../services/blogs'
const Blog = ({ blog, updateLikes }) => {
	const [isShow, setIsShow] = useState(false)
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	}
	const noneStyle = { display: 'none' }
	const showStyle = isShow ? blogStyle : noneStyle;
	const hiddenStyle = !isShow ? blogStyle : noneStyle;
	const handleShow = () => {
		setIsShow(!isShow)
	}
	const addlikes = async () => {
		const updateBlog = {
			...blog,
			likes: blog.likes + 1,
			user: blog.user?.id || blog.user
		}
		const updatedBlog = await blogService.update(updateBlog)
		updateLikes(updatedBlog)
	}
	return (
		<div>
			<div style={hiddenStyle}>
				{blog.title} {blog.author} <button type="button" onClick={handleShow}> {isShow ? 'hide' : 'view' }</button>
			</div>  
			<div style={showStyle}>
				<div>{blog.title} {blog.author} <button type="button" onClick={handleShow}> {isShow ? 'hide' : 'view' }</button></div>
				<div>{blog.url}</div>
				<div>likes {blog.likes} <button type="button" onClick={addlikes}>like</button></div>
				<div>{blog.user?.name}</div>
			</div>  
		</div>
	)
}

export default Blog
