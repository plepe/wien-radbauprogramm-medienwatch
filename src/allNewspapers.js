const allNewspapers = [
  require('./NewspaperMeinBezirk'),
  require('./NewspaperRathauskorrespondenz'),
  require('./NewspaperW24'),
  require('./NewspaperOrfTvThek'),
  require('./NewspaperYoutube')
]

module.exports = allNewspapers.map(N => new N())
