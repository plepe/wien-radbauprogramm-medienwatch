const allNewspapers = [
  new require('./NewspaperMeinBezirk')
]

module.exports = allNewspapers.map(N => new N())
