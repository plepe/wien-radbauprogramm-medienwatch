const allNewspapers = [
  require('./NewspaperMeinBezirk'),
  require('./NewspaperRathauskorrespondenz'),
  require('./NewspaperW24'),
  require('./NewspaperOrfTvThek'),
  require('./NewspaperYoutube'),
  require('./NewspaperTwitter'),
  require('./NewspaperDefault')
]

module.exports = allNewspapers.map(N => new N())
