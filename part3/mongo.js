const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url = `mongodb://fzucwj_db_user:${password}@ac-q7p2txp-shard-00-00.kysn00l.mongodb.net:27017,ac-q7p2txp-shard-00-01.kysn00l.mongodb.net:27017,ac-q7p2txp-shard-00-02.kysn00l.mongodb.net:27017/peopleApp?ssl=true&replicaSet=atlas-s1hib3-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(p => {
    console.log(`added ${p.name} number ${p.number} to phonebook`)
    mongoose.connection.close()
  })
}
