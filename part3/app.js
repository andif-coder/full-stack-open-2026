const express = require('express')
const config = require('./utils/config')
const middleWare = require('./utils/middleware')
const peopleRouter = require('./controllers/people')
const app = express()

// 连接数据库
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect(config.MONGODB_URL, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleWare.requestLogger)
app.use('/api/persons', peopleRouter)
app.use(middleWare.unkownEndpoint)
app.use(middleWare.errorHandler)
module.exports = app
