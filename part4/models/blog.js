const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
  title: {
		type: String,
		required: [true, 'title required']
	},
  author: String,
  url: {
		type: String,
		required: [true, 'url required']
	},
  likes: Number,
})
blogSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})
module.exports = mongoose.model('Blog', blogSchema)
