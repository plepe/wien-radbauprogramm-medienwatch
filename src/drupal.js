const DrupalRest = require('drupal-rest')
const config = require('../config.json')

let callbacks = []

const drupal = new DrupalRest(config.drupal)
drupal.login((err) => {
  if (err) {
    console.error(err)
  }

  callbacks.forEach(cb => cb())
})

drupal.whenLoggedIn = (callback) => {
  if (callbacks === null) {
    return callback()
  }

  callbacks.push(callback)
}

module.exports = drupal
