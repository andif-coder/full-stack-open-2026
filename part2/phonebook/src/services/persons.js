import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'
const getAll = () => {
	return axios.get(baseUrl).then(response => response.data)
}
const create = newPerson => {
	return axios.post(baseUrl, newPerson).then(response => response.data)
}
const remove = delPerson => {
	const delUrl = baseUrl + '/' + delPerson.id
	return axios.delete(delUrl)
}
export default {getAll, create, remove}
