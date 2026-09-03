const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	username: {
		type: String
	},
	name: {
		type: String
	},
	passwordHash: {
		type: String
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	]
})
userSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
		delete returnedObj.passwordHash
    delete returnedObj._id
    delete returnedObj.__v
  }
})
module.exports = mongoose.model('User', userSchema)
