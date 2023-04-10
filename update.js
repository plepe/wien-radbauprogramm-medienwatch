#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser

const NewspaperMeinBezirk = require('./src/NewspaperMeinBezirk')
const convert2Drupal = require('./src/convert2Drupal')
const drupal = require('./src/drupal')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Re-importiert einen Medienbericht in ein Drupal'
})

parser.add_argument('id', {
  help: 'ID des Nodes im drupal'
})

const args = parser.parse_args()

const newspaper = new NewspaperMeinBezirk()

drupal.nodeGet(args.id, (err, orig) => {
  newspaper.loadArticle(orig.field_url[0].uri, (err, article) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    const node = convert2Drupal(article)

    drupal.nodeSave(args.id, node, (err, result) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      console.log('https://wien.plepe.at/hauptrad/node/' + result.nid[0].value)
    })
  })
})
