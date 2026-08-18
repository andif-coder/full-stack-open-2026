const info = (...param) => {
  console.log('[INFO]', ...param)
}
const error = (...param) => {
  console.log('[ERROR]', ...param)
}
module.exports = { info, error }
