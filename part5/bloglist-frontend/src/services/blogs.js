import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.post(baseUrl, newBlog, config)
	return response.data
}

const update = async (updateBlog) => {
	const changeUrl = baseUrl + '/' + updateBlog.id
	const response = await axios.put(changeUrl, updateBlog)
	return response.data
}

const setToken = (newToken) => {
	token = `Bearer ${newToken}`
}

export default { getAll, create, setToken, update }
