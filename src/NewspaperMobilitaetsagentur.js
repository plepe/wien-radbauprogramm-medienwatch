const sprintf = require('sprintf-js').sprintf
const monthValue = require('./monthValue.js')
const getSel = require('./getSel.js')
const getSelAttr = getSel.attr

module.exports = class NewspaperMobilitaetsagentur {
  title () {
    return ''
  }

  matchUrlDocument ({url, document}) {
    if (url.match(/^https:\/\/mobilitaetsagentur\.at\//)) {
      return 10
    }
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const entry = {}

    entry.url = getSelAttr(document, 'meta[property="og:url"]', 'content')
    entry.medium = 'Mobilitätsagentur Wien'
    entry.type = 'press_release'
    entry.title = getSelAttr(document, 'meta[property="og:title"]', 'content').split(/\n/)[0]

    let date = document.querySelector('.news-card-date').textContent.trim()
    const m = date.match(/^([0-9]+)\. ([A-Za-z]+) ([0-9]{4})$/)
    entry.date = sprintf('%04d-%02d-%02d', m[3], monthValue[m[2]], m[1])

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
