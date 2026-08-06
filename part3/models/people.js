const mongoose = require('mongoose')
const url = process.env.MONGODB_URL
mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })
	.then(ret => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message)
	})
const personSchema = new mongoose.Schema({
  name: {
		type: String,
		minLength: 3,
		required: true
	},
  number: {
		type: String,
		required: true
	}
})
personSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = returnedObj._id.toString()
		delete returnedObj._id
		delete returnedObj.__v
	}
})

module.exports = mongoose.model('Person', personSchema)
