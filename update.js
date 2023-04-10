#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser

const update = require('./src/update')
const drupal = require('./src/drupal')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Re-importiert einen Medienbericht in ein Drupal'
})

parser.add_argument('id', {
  help: 'ID des Nodes im drupal'
})

const args = parser.parse_args()

update(args.id, (err, result) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log('https://wien.plepe.at/hauptrad/node/' + result.nid[0].value)
})
