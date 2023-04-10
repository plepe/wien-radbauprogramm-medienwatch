const findNewspaper = require('./findNewspaper')
const convert2Drupal = require('./convert2Drupal')
const drupal = require('./drupal')

module.exports = function newsImport (id, url, callback) {
  const newspaper = findNewspaper(url)
  if (!newspaper) {
    return callback(new Error('No newspaper module found for ' + url))
  }

  newspaper.loadArticle(url, (err, article) => {
    if (err) { return callback(err) }

    const node = convert2Drupal(article)

    drupal.nodeSave(id, node, (err, result) => {
      if (err) { return callback(err) }

      callback(null, result)
    })
  })
}
