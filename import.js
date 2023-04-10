#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser

const NewspaperMeinBezirk = require('./src/NewspaperMeinBezirk')
const convert2Drupal = require('./src/convert2Drupal')
const drupal = require('./src/drupal')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Importiert einen Medienbericht in ein Drupal'
})

parser.add_argument('url', {
  help: 'URL von wo der Medienbericht geladen werden soll.'
})

const args = parser.parse_args()

const newspaper = new NewspaperMeinBezirk()

newspaper.loadArticle(args.url, (err, article) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const node = convert2Drupal(article)

  drupal.nodeSave(null, node, (err, result) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log('https://wien.plepe.at/hauptrad/node/' + result.nid[0].value)
  })
})
