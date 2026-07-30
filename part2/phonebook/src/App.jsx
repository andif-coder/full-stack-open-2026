import { useState } from 'react'

const Person = ({person}) => {
	return (
		<p> {person.name} </p>
	)
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')
	const handleNewName = (event) => {
		// console.log(event.target.value)
		setNewName(event.target.value)
	}
	const addPerson = (event) => {
		event.preventDefault()
		if (persons.length > 0) {
			const exist = persons.some(person => person.name == newName)
			if (exist) {
				alert(newName + " is already added to phonebook")
				return
			}
		}
		const newPerson = {
			name: newName
		}
		setPersons(persons.concat(newPerson))
		setNewName('')
	}

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewName}/>
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
