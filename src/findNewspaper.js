const allNewspapers = require('./allNewspapers')

module.exports = function findNewspaper (url, funcname) {
  // match may return a likely-hood:
  // true = yes, this is it
  // 10 = almost perfect
  // 1 = fall-back option
  // 0/false = no
  const newspapersMatch = allNewspapers.map(n => {
    let m = n[funcname] ? n[funcname](url) : false
    if (m === true) { m = 9999 }
    if (m === false ) { m = 0 }
    return [ m, n ]
  })
  const newspapers = newspapersMatch
    .sort((a, b) => {
      return b[0] - a[0]
    })
    .filter(v => v[0] > 0)
    .map(v => v[1])

  return newspapers.length ? newspapers[0] : null
}
