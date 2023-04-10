const loadArticle = require('./src/loadArticle')
const convert2Drupal = require('./src/convert2Drupal')
const drupal = require('./src/drupal')

const url = process.argv[process.argv.length - 1]

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

    console.log('https://wien.plepe.at/hauptrad/node/' + result.nid[0].value)
  })
})
