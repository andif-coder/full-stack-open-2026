const reverse = (string) => {
  return string.split('').reverse().join('')
}
const average = (array) => {
  if (array.length === 0) return 0
  return array.reduce((sum, a) => { return sum + a }, 0) / array.length
}
module.exports = { reverse, average }
