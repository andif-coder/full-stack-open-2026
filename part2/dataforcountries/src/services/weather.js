import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY
const getWeatherOf = country => {
	const url =`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric` 
	console.log(url)
	return axios.get(url).then(response => response.data)
}
export default { getWeatherOf }
