const findNewspaper = require('./findNewspaper')
const downloadFiles = require('./downloadFiles')

module.exports = function loadUrl (url, callback) {
  const newspaper = findNewspaper(url)
  if (!newspaper) {
    return callback(new Error('No newspaper module found for ' + url))
  }

  newspaper.loadArticle(url, {}, (err, article) => {
    if (err) { return callback(err) }

    downloadFiles(article, (err) => callback(err, article))
  })
}
