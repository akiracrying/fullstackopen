import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])
  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find(p => p.name == newName)
    if (existing) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existing, number: newNumber }
        personService.update(existing.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id != returnedPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessageType('success')
            setMessage(`Changed number for ${returnedPerson.name}`)
            setTimeout(() => { setMessage(null) }, 5000)
          })
          .catch(error => {
            setMessageType('error')
            setMessage(`Information of ${existing.name} has already been removed from server`)
            setTimeout(() => { setMessage(null) }, 5000)
            setPersons(persons.filter(p => p.id != existing.id))
          })
      }
      return
    }
    const personObject = { name: newName, number: newNumber }
    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setMessageType('success')
      setMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => { setMessage(null) }, 5000)
    })
  }
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id != id))
      })
    }
  }
  const personsToShow = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
