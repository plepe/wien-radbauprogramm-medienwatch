const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = function loadArticle (url, callback) {
  fetch(url)
    .then(req => req.text())
    .then(body => {
      const dom = new JSDOM(body)
      const document = dom.window.document

      const title = document.querySelector('meta[property="og:title"]').getAttribute('content')
      const date = document.querySelector('meta[property="article:published_time"]').getAttribute('content').split('T')[0]

      const content = document.querySelector('div[data-content-text=""]')
      const images = []

      Array.from(content.children).forEach(p => {
        if (!['P', 'H2', 'H3'].includes(p.nodeName)) {
          content.removeChild(p)
        }

        if (p.textContent.trim() === 'Das könnte dich auch interessieren:' || p.textContent.trim() === '' || p.textContent.trim() === 'Mehr zu Thema:') {
          content.removeChild(p)
        }

        if (p.nodeName === 'FIGURE') {
          const img = p.querySelector('img')
          images.push({
            src: img.getAttribute('data-src').split('?')[0],
            alt: img.getAttribute('alt')
          })
        }
      })

      const entry = { title, url, date, content: content.innerHTML, images }

      callback(null, entry)
    })
}
