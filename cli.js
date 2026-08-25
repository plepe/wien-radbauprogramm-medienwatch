#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const loadUrl = require('./src/loadUrl')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Lädt einen Medienbericht und gibt die Informationen als JSON aus.'
})

parser.add_argument('url', {
  help: 'URL von wo der Medienbericht geladen werden soll.'
})

const args = parser.parse_args()
const url = args.url

loadUrl(url, (err, result) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(JSON.stringify(result, null, '  '))
})
