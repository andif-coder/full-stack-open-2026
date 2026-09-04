const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleWare = require('./utils/middleware')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const app = express()

// 连接数据库
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect(config.MONGODB_URL, { family: 4 })
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
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app
