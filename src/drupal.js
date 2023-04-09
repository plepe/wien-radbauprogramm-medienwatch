const DrupalRest = require('drupal-rest')
const config = require('../config.json')

const drupal = new DrupalRest(config.drupal)
drupal.login((err) => {
  if (err) {
    console.error(err)
  }

  console.log('login')
})

module.exports = drupal
