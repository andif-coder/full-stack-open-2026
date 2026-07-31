import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({person}) => {
	return (
		<p> {person.name} {person.number} </p>
	)
}

const Filter = ({filter, onChange}) => {
	return (
		<div> filter shown with: <input value={filter} onChange={onChange}/> </div>
	)
}

const Persons = ({persons}) => {
	return (
		<div> {
			persons.map(person => <Person key={person.name} person={person} />)
		} </div>
	)
}

const PersonForm = ({onSubmit, newName, onChangeName, newNum, onChangeNum}) => {
	return (
		<form onSubmit={onSubmit}>
			<h2>add a new</h2>
			<div>
				name: <input value={newName} onChange={onChangeName}/>
			</div>
			<div>
				number: <input value={newNum} onChange={onChangeNum}/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
	const [filter, setFilter] = useState('')
	
	useEffect(() => {
		axios.get('http://localhost:3001/persons')
			.then(persons => {
				console.log('成功从服务器获取数据')
				console.log(persons.data)
				setPersons(persons.data)
			})
			.catch(error => {
				console.log('从服务器获取数据失败, 报错:', error)
			})
	}, [])

	const handleNewName = (event) => {
		setNewName(event.target.value)
	}
	const handleNewNum = (event) => {
		setNewNum(event.target.value)
	}
	const handleFilter = (event) => {
		setFilter(event.target.value)
	}
	const addPerson = (event) => {
		event.preventDefault()
		const exist = persons.some(person => person.name === newName)
		if (exist) {
			alert(`${newName} is already added to phonebook`)
			return
		}
		const newPerson = {
			name: newName,
			number: newNum
		}
		setPersons(persons.concat(newPerson))
		setNewName('')
		setNewNum('')
	}
	const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
			<Filter filter={filter} onChange={handleFilter} />
			<PersonForm onSubmit={addPerson} newName={newName} onChangeName={handleNewName} newNum={newNum} onChangeNum={handleNewNum} />
      <h2>Numbers</h2>
			<Persons persons={personsToShow} />
    </div>
  )
}

export default App
