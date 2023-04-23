const allNewspapers = [
  require('./NewspaperMeinBezirk'),
  require('./NewspaperRathauskorrespondenz'),
  require('./NewspaperW24'),
  require('./NewspaperYoutube')
]

module.exports = allNewspapers.map(N => new N())
