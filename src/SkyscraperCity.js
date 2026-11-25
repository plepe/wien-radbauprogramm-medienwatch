const path = require('path')
const loadDocument = require('./loadDocument.js')
const getSel = require('./getSel.js')
const getSelAttr = getSel.attr
const getSelText = getSel.text

module.exports = class StadtWienVergabeportal {
  title () {
    'SkyscraperCity'
  }

  match (url) {
    return !!url.match(/^https:\/\/www.skyscrapercity.com\/threads\//)
  }

  loadArticle (url, node, callback) {
    const m = url.match(/^https:\/\/www.skyscrapercity.com\/threads\/.*(post-[0-9]+)$/)
    const postId = m[1]

    loadDocument(url, (err, document) => {
      const article = document.querySelector('article[data-content="' + postId + '"]')

      if (!article) {
        return callback(new Error("Can't find post"))
      }

      const content = article.querySelector('article.message-body')
      const images = []

      Array.from(content.querySelectorAll('div.lazyloadPreSize')).forEach(div => {
        div.parentNode.removeChild(div)
        const img = div.querySelector('img')

        if (img) {
          const p = path.parse(img.getAttribute('data-src'))
          const m = p.dir.match(/\/([^/]+)\.[0-9]+$/)
          const filename = m ? m[1].replace(/-([^-]+)$/, '.$1') : path.basename(p.dir)

          const image = {
            src: p.dir,
            filename,
            alt: img.getAttribute('alt')
          }

          images.push(image)
        }
      })

      let title = content.textContent.trim().split(/[\n,]/)[0]

      const entry = {
        title,
        url: getSelAttr(article, 'meta[itemprop="url"]', 'content'),
        medium: getSelText(article, 'section[itemprop="author"] .message-userDetails a'),
        date: getSelAttr(article, 'meta[itemprop="datePublished"]', 'content'),
        content: content.innerHTML.trim(),
        images
      }

      callback(null, entry)
    })
  }
}
