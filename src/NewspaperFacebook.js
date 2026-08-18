const async = require('async')
const childProcess = require('child_process')
const fs = require('fs')
const config = require('../config.json')

module.exports = class NewspaperFacebook {
  title () {
    return ''
  }

  matchUrlDocument ({url, document}) {
    if (url.match(/^https:\/\/www\.facebook\.com\//)) {
      return 5
    }
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const entry = {}

//    entry.url = getSelAttr(document, 'meta[property="og:url"]', 'content')
//    entry.title = getSelAttr(document, 'meta[property="og:description"]', 'content').split(/\n/)[0]
//    entry.medium = getSelAttr(document, 'meta[property="og:title"]', 'content')
    entry.type = 'soecial_media'

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}

function getSelAttr (document, selector, attribute) {
  const sel = document.querySelector(selector)
  if (!sel) {
    return undefined
  }

  return sel.getAttribute(attribute)
}

function getSelText (document, selector) {
  const sel = document.querySelector(selector)
  if (!sel) {
    return undefined
  }

  return sel.textContent.trim()
}
