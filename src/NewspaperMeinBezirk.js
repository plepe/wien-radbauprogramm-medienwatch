const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class NewspaperMeinBezirk {
  loadArticle (url, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document

        const title = document.querySelector('meta[property="og:title"]').getAttribute('content')
        const date = document.querySelector('meta[property="article:published_time"]').getAttribute('content').split('T')[0]

        const content = document.querySelector('div[data-content-text=""]')
        const images = []

        const headerPict = document.querySelector('header picture')
        if (headerPict) {
          const dimensions = headerPict.querySelector('source').getAttribute('srcset').split(', ')
          images.push({
            src: dimensions.pop().split('?')[0],
            alt: headerPict.querySelector('img').getAttribute('alt')
          })
        }

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
              src: img.getAttribute('data-src').split('?')[0].replace('_L.jpg', '_XXL.jpg'),
              alt: img.getAttribute('alt')
            })
          }
        })

        const entry = { title, url, date, content: content.innerHTML, images }

        callback(null, entry)
      })
  }
}
