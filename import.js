const loadArticle = require('./src/loadArticle')
const convert2Drupal = require('./src/convert2Drupal')
const drupal = require('./src/drupal')

const url = ''

loadArticle(url, (err, article) => {
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

    console.log('Saved as node ' + result.nid[0].value)
  })
})
