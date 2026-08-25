const allNewspapers = [
  require('./NewspaperMeinBezirk'),
  require('./NewspaperRathauskorrespondenz'),
  require('./NewspaperW24'),
  require('./NewspaperOrfTvThek'),
  require('./NewspaperOrfAt'),
  require('./NewspaperYoutube'),
  require('./NewspaperTwitter'),
  require('./NewspaperFacebook'),
  require('./NewspaperBluesky'),
  require('./StadtWienVergabeportal'),
  require('./NewspaperDefault')
]

module.exports = allNewspapers.map(N => new N())
