const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class NewspaperMeinBezirk {
  title () {
    return 'MeinBezirk.at'
  }

  match (url) {
    return url.match(/^https:\/\/(www\.)?meinbezirk\.at\//)
  }

  loadArticle (url, node, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document

        const title = document.querySelector('meta[property="og:title"]').getAttribute('content')
        const date = document.querySelector('meta[property="article:published_time"]').getAttribute('content').split('T')[0]

        const contentImages = document.querySelectorAll('.image-loop-container img')
        const images = Array.from(contentImages).map(img => {
          return {
            src: img.getAttribute('data-src').split('?')[0]
              .replace('_L.jpg', '_XXL.jpg')
              .replace('_L.webp', '_XXL.webp'),
            alt: img.getAttribute('alt')
          }
        })

        const content = document.querySelector('div[data-content-text=""]')
        Array.from(content.children).forEach(p => {
          if (!['P', 'H2', 'H3'].includes(p.nodeName)) {
            content.removeChild(p)
          }

          if (p.textContent.trim() === 'Das könnte dich auch interessieren:' || p.textContent.trim() === '' || p.textContent.trim() === 'Mehr zu Thema:') {
            content.removeChild(p)
          }
        })

        const entry = { title, url, date, content: content.innerHTML, images }

        callback(null, entry)
      })
  }
}
