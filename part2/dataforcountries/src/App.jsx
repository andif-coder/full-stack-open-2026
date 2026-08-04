import { useState, useEffect } from 'react'
import countriesServices from './services/countries'
import weatherServices from './services/weather'
const Filter = ({filter, onChange}) => {
	return (
		<div>
			flter countries: <input value={filter} onChange={onChange}/>
		</div>
	)
}
const Country = ({country}) => {
	return (
		<div>
			<h1>{country.name.common}</h1>
			<p>{country.capital?.[0]}</p>
			<p>{country.area}</p>
			<h1>Languages</h1>
			<ul>
				{Object.values(country.languages || {}).map(c => <li key={c}>{c}</li>)}
			</ul>
			<img src={country.flags.png} alt='国旗' width='150' />
		</div>
	)
}
const ShowCountries = ({countriesToShow, elseShowCountryFunc}) => {
	if (countriesToShow.length > 10) {
		return <div><p>Too many matches, specify another filter</p></div>
	} else if (countriesToShow.length > 1) {
		return (
			<div>
				{countriesToShow.map(c => <p key={c.cca2}>{c.name.common} <button onClick={elseShowCountryFunc(c)}>show</button></p>)}
			</div>
		)
	} else if (countriesToShow.length === 1) {
		const country = countriesToShow[0]
		return (
			<div>
				<Country country={country} />
				<ShowWeather country={country} />
			</div>
		)
	}
	return (
		<div></div>
	)
}
const ShowWeather = ({country}) => {
	const [weather, setWeather] = useState(null)
	useEffect(() => {
		weatherServices
			.getWeatherOf(country)
			.then(ret => {
				console.log(`获取${country.capital?.[0]}的天气成功，数据：`)
				console.log(ret)
				setWeather(ret)
			})
			.catch(error => {
				console.log(`获取${country.capital?.[0]}的天气失败，报错：${error}`)
			})
	}, [country])
	if (!weather) {
		return (
			<div>Loading weather...</div>
		)
	}
	console.log(weather.weather[0].icon)
	return (
		<div>
			<h1>Weather in {country.capital?.[0]}</h1>
			<p>Temperature {weather.main.temp} Celsius</p>
			<img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`} alt='weather icon' />
			<p>Wind {weather.wind.speed} m/s</p>
		</div>
	)
}
const App = () => {
	const [filter, setFilter] = useState('')
	const [allCountriesInfo, setAllCountriesInfo] = useState([])
	const [elseShowCountry, setElseShowCountry] = useState([])
	const elseShowCountryFunc = (country) => {
		return () => {
			setElseShowCountry([].concat(country))
		}
	}
	const handleFilter = (event) => {
		console.log(event.target.value)
		setFilter(event.target.value)
		setElseShowCountry([])
	}
	useEffect(() => {
		countriesServices
			.getAll()
			.then(ret => {
				// console.log('获取所有国家的数据成功，数据：', ret)
				setAllCountriesInfo(ret)
			})
			.catch(error => {
				console.log('获取所有国家的数据出现错误，报错：', error)
			})
	}, [])
	console.log('获取所有国家的数据成功，数据：', allCountriesInfo)
	const countriesToShow = filter.trim() === '' ? [] : allCountriesInfo.filter(r => r.name.common.toLowerCase().includes(filter.toLowerCase()))
	console.log('过滤后的国家是: ', countriesToShow)
	console.log('filter: ', filter)
  return (
		<div>
			<Filter filter={filter} onChange={handleFilter} />
			<ShowCountries countriesToShow={elseShowCountry.length ? elseShowCountry : countriesToShow} elseShowCountryFunc={elseShowCountryFunc} />
		</div>
  )
}

export default App
