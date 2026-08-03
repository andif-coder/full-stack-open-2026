import { useState, useEffect } from 'react'
import countriesServices from './services/countries'
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
			<p>{country.capital?.join(', ')}</p>
			<p>{country.area}</p>
			<h1>Languages</h1>
			<ul>
				{Object.values(country.languages).map(c => <li key={c}>{c}</li>)}
			</ul>
			<img src={country.flags.png} alt='国旗' width='150' />
		</div>
	)
}
const ShowCountries = ({countriesToShow}) => {
	if (countriesToShow.length > 10) {
		return <div><p>Too many matches, specify another filter</p></div>
	} else if (countriesToShow.length > 1) {
		return (
			<div>
				{countriesToShow.map(c => <p key={c.cca2}>{c.name.common}</p>)}
			</div>
		)
	} else if (countriesToShow.length === 1) {
		const country = countriesToShow[0]
		return <Country country={country} />
	}
	return (
		<div></div>
	)
}
const App = () => {
	const [filter, setFilter] = useState('')
	const [allCountriesInfo, setAllCountriesInfo] = useState([])
	const handleFilter = (event) => {
		console.log(event.target.value)
		setFilter(event.target.value)
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
  return (
		<div>
			<Filter filter={filter} onChange={handleFilter} />
			<ShowCountries countriesToShow={countriesToShow} />
		</div>
  )
}

export default App
