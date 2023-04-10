const drupal = require('./drupal')
const import = require('./import')

module.exports = function update (id, callback) {
  drupal.nodeGet(id, (err, orig) => {
    if (err) { return callback(err) }

    import(id, orig.field_url[0].uri, callback)
  })
}
