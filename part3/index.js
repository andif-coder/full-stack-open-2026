const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
const PORT = config.PORT || 3001
app.listen(PORT, () => {
  logger.info(`phonebook server running on port ${PORT}`)
})
