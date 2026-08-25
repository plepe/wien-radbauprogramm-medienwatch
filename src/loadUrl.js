const findNewspaper = require('./findNewspaper')
const downloadFiles = require('./downloadFiles')
const loadDocument = require('./loadDocument')

module.exports = function loadUrl (url, callback) {
  let newspaper = findNewspaper(url, 'match')
  if (newspaper) {
    return newspaper.loadArticle(url, {}, (err, article) => {
      if (err) { return callback(err) }

      //downloadFiles(article, (err) => callback(err, article))
      callback(null, article, newspaper)
    })
  }

  loadDocument(url, (err, document) => {
    newspaper = findNewspaper({url, document}, 'matchUrlDocument')
    if (!newspaper) {
      return callback(new Error('No newspaper module found for ' + url))
    }

    newspaper.loadArticleFromDocument({url, document}, {}, (err, article) => {
      if (err) { return callback(err) }

      //downloadFiles(article, (err) => callback(err, article))
      callback(null, article, newspaper)
    })
  })
}
