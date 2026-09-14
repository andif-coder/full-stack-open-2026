import { useParams } from 'react-router-dom'
import { Card, Box, CardContent, Typography, Link as MuiLink, Button } from '@mui/material'
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
		<Box sx={{ mt: 3, maxWidth: 600 }}>
			<Card variant="outlined">
				<CardContent sx = {{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
					<Typography variant="h5" component="h2" sx = {{ fontWeight: 'bold' }}>
						{blog.title}
					</Typography>
					<Typography variant="body2">
						<MuiLink href={blog.url} target="_blank" rel="noopener noreferrer">
							{blog.url}
						</MuiLink>
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Added by {blog.user?.name}
					</Typography>
					<Box sx = {{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
						<Typography variant="body1" sx = {{ fontWeight: 'medium' }}>
							{blog.likes} likes
						</Typography>
						<Button
							variant="outlined"
							size="small"
							onClick={addlikes}
						> 
							LIKE
						</Button>
						{ showRemove && (
							<Button
								variant="outlined"
								color="error"
								size="small"
								onClick={deleteBlog}
							>
								REMOVE
							</Button>
						)}
					</Box>
				</CardContent>
			</Card>
		</Box>
  )
}

export default Blog
