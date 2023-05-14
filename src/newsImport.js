const async = require('async')

const findNewspaper = require('./findNewspaper')
const convert2Drupal = require('./convert2Drupal')
const drupal = require('./drupal')

module.exports = function newsImport (id, url, node, callback) {
  const newspaper = findNewspaper(url)
  if (!newspaper) {
    return callback(new Error('No newspaper module found for ' + url))
  }

  async.parallel({
    origNode: (done) => {
      if (id) {
        drupal.nodeGet(id, done)
      } else {
        done(null, {})
      }
    },
    newNode: (done) => {
      newspaper.loadArticle(url, node, (err, article) => {
        if (err) { return done(err) }

        const node = convert2Drupal(newspaper, article)
        done(null, node)
      })
    }
  },
  (err, { origNode, newNode }) => {
    if (err) { return callback(err) }

    const update = {}

    Object.keys(newNode).forEach(k => {
      if (k.match(/^field_content_/) || !(k in origNode) || !origNode[k].length) {
        update[k] = newNode[k]
      }
    })
    update.type = newNode.type

    drupal.nodeSave(id, update, (err, result) => {
      if (err) { return callback(err) }

      callback(null, result)
    })
  })
}
