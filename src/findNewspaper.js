const allNewspapers = require('./allNewspapers')

module.exports = function findNewspaper (url) {
  const newspapers = allNewspapers.filter(n => n.match(url))

  return newspapers.length ? newspapers[0] : null
}
