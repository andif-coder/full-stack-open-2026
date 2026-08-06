import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Notification from './components/Notification'

const Remove = ({onClick}) => {
	return <button onClick={onClick} > delete </button>
}

const Person = ({person, delFunc}) => {
	return (
		<p> {person.name} {person.number} <Remove onClick={delFunc} /> </p>
	)
}

const Filter = ({filter, onChange}) => {
	return (
		<div> filter shown with: <input value={filter} onChange={onChange}/> </div>
	)
}

const Persons = ({persons, delFunc}) => {
	return (
		<div> {
			persons.map(person => <Person key={person.id} person={person} delFunc={delFunc(person)} />)
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
	const [msgObj, setMsgObj] = useState({
		type: 'success',
		content: null
	})
	
	useEffect(() => {
		personServices
			.getAll()
			.then(allPersons => {
				console.log('成功从服务器获取数据')
				console.log(allPersons)
				setPersons(allPersons)
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
	const setNewMsg = (type, content) => {
		const newMsg = { type, content }
		setMsgObj(newMsg)
		setTimeout(() => {
			setMsgObj({type: 'success', content: null})
		}, 3000)
	}
	const addPerson = (event) => {
		event.preventDefault()
		const exist = persons.some(person => person.name === newName)
		if (exist) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
				const oldPerson = persons.find(person => person.name === newName)
				const changedPerson = {
					...oldPerson,
					number: newNum
				}
				personServices
					.update(changedPerson)
					.then(response => {
						setNewMsg('success', '修改' + response.name + '对应号码成功')
						console.log(`成功修改${response.name}电话号码为${response.number}`)
						setPersons(persons.map(p => p.id !== response.id ? p : response))
						setNewName('')
						setNewNum('')
					})
					.catch(error => {
						setNewMsg('error', error.response.data.error)
						setPersons(persons.filter(p => p.id !== changedPerson.id))
						setNewName('')
						setNewNum('')
					})
			}
			return
		}
		const newPerson = {
			name: newName,
			number: newNum
		}
		personServices
			.create(newPerson)
			.then(person => {
				console.log(`新增${newPerson.name}成功，数据: ${person.name}`)
				setNewMsg('success', '新增' + newPerson.name + '成功')
				setPersons(persons.concat(person))
				setNewName('')
				setNewNum('')
			})
			.catch(error => {
				console.log(`新增${newPerson.name}失败，报错: ${error}`)
				setNewMsg('error', error.response.data.error)
			})
	}
	const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
	const delPerson = (person) => {
		return () => {
			if (window.confirm(`删除 ${person.name} ?`)) {
				personServices
					.remove(person)
					.then(() => {
						console.log(`删除${person.name}成功`)
						setPersons(persons.filter(p => p.id !== person.id))
					})
					.catch(error => {
						console.log(`删除${person.name}失败，报错: ${error}`)
					})
			}
		}
	}

  return (
    <div>
      <h2>Phonebook</h2>
			<Notification msg={msgObj} />
			<Filter filter={filter} onChange={handleFilter} />
			<PersonForm onSubmit={addPerson} newName={newName} onChangeName={handleNewName} newNum={newNum} onChangeNum={handleNewNum} />
      <h2>Numbers</h2>
			<Persons persons={personsToShow} delFunc={delPerson}/>
    </div>
  )
}

export default App
