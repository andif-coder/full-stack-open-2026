import { useState } from 'react'

const Person = ({person}) => {
	return (
		<p> {person.name} {person.number} </p>
	)
}

const App = () => {
  const [persons, setPersons] = useState([{
		name: 'Arto Hellas',
		number: '110'
	}]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
	const handleNewName = (event) => {
		setNewName(event.target.value)
	}
	const handleNewNum = (event) => {
		setNewNum(event.target.value)
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

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewName}/>
          number: <input value={newNum} onChange={handleNewNum}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
			<div>
				{
					persons.map(person => <Person key={person.name} person={person} />)
				}
			</div>
    </div>
  )
}

export default App
