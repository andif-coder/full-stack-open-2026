const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`blog list server running on port ${PORT}`)
})
