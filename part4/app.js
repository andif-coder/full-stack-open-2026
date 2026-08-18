const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleWare = require('./utils/middleware')
const blogRouter = require('./controllers/blog')
const app = express()

// 连接数据库
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const MONGODB_URL = process.env.NODE_ENV === 'test'
	? process.env.TEST_MONGODB_URL
	: process.env.MONGODB_URL
logger.info(MONGODB_URL)
mongoose.connect(MONGODB_URL, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error(`error connecting to MongoDB:, ${error.message}`)
  })
app.use(express.static('dist'))
app.use(express.json())
app.use(middleWare.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleWare.unkownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app
