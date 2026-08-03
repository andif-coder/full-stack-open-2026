import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const getAll = () => {
	const allUrl = baseUrl + '/all'
	return axios.get(allUrl).then(response => response.data)
}
const getOfName = name => {
	console.log(name)
	const nameUrl = baseUrl + '/name/' + name
	return axios.get(nameUrl).then(response => response.data)
}

export default { getAll, getOfName }
