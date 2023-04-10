#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser
const async = require('async')

const update = require('./src/update')
const convert2Drupal = require('./src/convert2Drupal')
const drupal = require('./src/drupal')

const parser = new ArgumentParser({
  add_help: true,
  description: 'Re-importiert einen Medienbericht in ein Drupal'
})

const args = parser.parse_args()

drupal.whenLoggedIn(() => {
  console.log('when logged in')
  drupal.get('medienberichte-auto-update.json', (err, data) => {
    data = JSON.parse(data)

    async.eachSeries(data, (item, done) => {
      update(item.nid, done)
    })
  })
})
