const drupal = require('./drupal')
const newsImport = require('./newsImport')

module.exports = function update (id, callback) {
  drupal.nodeGet(id, (err, orig) => {
    if (err) { return callback(err) }

    newsImport(id, orig.field_url[0].uri, orig, callback)
  })
}
