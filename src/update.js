#!/usr/bin/env node
const NewspaperMeinBezirk = require('./NewspaperMeinBezirk')
const convert2Drupal = require('./convert2Drupal')
const drupal = require('./drupal')

module.exports = function update (id, callback) {
  drupal.nodeGet(id, (err, orig) => {
    if (err) { return callback(err) }

    const newspaper = new NewspaperMeinBezirk()
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
