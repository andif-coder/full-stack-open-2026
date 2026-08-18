const dummy = (_blogs) => {
  return _blogs || 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((cur, pre) => (cur.likes > pre.likes ? cur : pre))
}
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  let author = '', blogs_cnt = 0
  const map = new Map()
  blogs.forEach((blog) => {
    const key = blog.author
    map.set(key, (map.get(key) || 0) + 1)
    const cnt = map.get(key)
    if (cnt > blogs_cnt) {
      blogs_cnt = cnt
      author = key
    }
  })
  return { author: author, blogs: blogs_cnt }
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  let author = '', likes_cnt = 0
  const map = new Map()
  blogs.forEach((blog) => {
    const key = blog.author
    map.set(key, (map.get(key) || 0) + blog.likes)
    const cnt = map.get(key)
    if (cnt > likes_cnt) {
      likes_cnt = cnt
      author = key
    }
  })
  return { author: author, likes: likes_cnt }
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
