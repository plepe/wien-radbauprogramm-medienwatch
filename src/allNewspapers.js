const allNewspapers = [
  require('./NewspaperMeinBezirk'),
  require('./NewspaperRathauskorrespondenz')
]

module.exports = allNewspapers.map(N => new N())
