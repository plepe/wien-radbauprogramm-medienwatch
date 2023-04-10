#!/usr/bin/env node
const findNewspaper = require('./findNewspaper')
const convert2Drupal = require('./convert2Drupal')
const drupal = require('./drupal')

module.exports = function update (id, callback) {
  drupal.nodeGet(id, (err, orig) => {
    if (err) { return callback(err) }

    const newspaper = findNewspaper(orig.field_url[0].uri)
    if (!newspaper) {
      return callback(new Error('No newspaper module found for ' + orig.field_url[0].uri))
    }

    newspaper.loadArticle(orig.field_url[0].uri, (err, article) => {
      if (err) { return callback(err) }

      const node = convert2Drupal(article)

      drupal.nodeSave(id, node, (err, result) => {
        if (err) { return callback(err) }

        callback(null, result)
      })
    })
  })
}
