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
    entry.title = document.querySelector('head title').textContent

    const date = document.querySelector('.news-card-date').textContent.trim()
    const m = date.match(/^([0-9]+)\. ([A-Za-z]+) ([0-9]{4})$/)
    entry.date = sprintf('%04d-%02d-%02d', m[3], monthValue[m[2]], m[1])

    let content = ''
    Array.from(document.querySelectorAll('.text-content')).forEach(div => {
      content += div.innerHTML.trim()
    })

    const linklist = document.querySelector('wm-section.linklist-block')
    if (linklist) {
      content += '\n' + linklist.querySelector('ul').outerHTML
    }

    const images = []
    let img = document.querySelector('wm-stage picture img')
    if (img) {
      images.push({
        src: 'https://mobilitaetsagentur.at' + img.src,
        alt: img.alt
      })
    }

    const galleries = document.querySelectorAll('.masonry-gallery')
    Array.from(galleries).forEach(gallery => {
      Array.from(gallery.querySelectorAll('a')).forEach(link => {
        images.push({
          src: 'https://mobilitaetsagentur.at' + link.href,
          alt: link.getAttribute('data-alt')
        })
      })
    })

    if (content) {
      content = '<p>' + getSelAttr(document, 'meta[property="og:description"]', 'content') + '</p>\n' + content
      entry.content = content
      entry.images = images
    }

    callback(null, entry)
  }

  cleanUp (callback) {
    callback(null)
  }
}
