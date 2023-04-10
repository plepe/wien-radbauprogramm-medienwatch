#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser

const newsImport = require('./src/newsImport')
const drupal = require('./src/drupal')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Importiert einen Medienbericht in ein Drupal'
})

parser.add_argument('url', {
  help: 'URL von wo der Medienbericht geladen werden soll.'
})

const args = parser.parse_args()

drupal.whenLoggedIn((err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  newsImport(null, args.url, (err, result) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log('https://wien.plepe.at/hauptrad/node/' + result.nid[0].value)
  })
})
