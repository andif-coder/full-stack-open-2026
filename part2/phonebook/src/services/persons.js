import axios from 'axios'
const baseUrl = 'https://backend-lw5i.onrender.com/api/persons'
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
const update = changedPerson => {
	const changedUrl = baseUrl + '/' + changedPerson.id
	return axios.put(changedUrl, changedPerson).then(response => response.data)
}
export default {getAll, create, remove, update}
