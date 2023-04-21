#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const findNewspaper = require('./src/findNewspaper')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Lädt einen Medienbericht und gibt die Informationen als JSON aus.'
})

parser.add_argument('url', {
  help: 'URL von wo der Medienbericht geladen werden soll.'
})

const args = parser.parse_args()
const url = args.url

const newspaper = findNewspaper(url)
if (!newspaper) {
  console.log('No newspaper module found for ' + url)
  process.exit(1)
}

newspaper.loadArticle(url, (err, article) => {
  if (err) { return callback(err) }

  console.log(JSON.stringify(article, null, '  '))
})
