const async = require('async')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class NewspaperRathauskorrespondenz {
  title () {
    return 'Rathauskorrespondenz'
  }

  match (url) {
    return url.match(/^https:\/\/(presse\.wien\.gv\.at\/|www\.wien\.gv\.at\/presse\/)/)
  }

  loadArticle (url, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document

        const title = document.querySelector('.pressemeldung-heading > h1').textContent
        const date = document.querySelector('meta[name="date"]').getAttribute('content').split('T')[0]

        const content = document.querySelector('.pressemeldung-table > .pressemeldung-td-left')
        Array.from(content.children).forEach(p => {
          if ((p.nodeName === 'H2' && p.className === 'rueckfragehinweis') ||
              (p.className === 'pressemeldung-rueckfrage') ||
              (p.className === 'socialMediaButtons')) {
            content.removeChild(p)
          }
        })

        const contentImages = document.querySelectorAll('.pressemeldung-td-right figure')
        const entry = { title, url, date, content: content.innerHTML }

        async.map(contentImages, (figure, done) => {
          const link = figure.querySelector('a').getAttribute('href')

          fetch(link)
            .then(req => req.text())
            .then(body => {
              const dom = new JSDOM(body)
              const document = dom.window.document

              const src = document.querySelector('div.entry-links > a').getAttribute('href')
              const alt = document.querySelector('div.entry-description').innerHTML.trim()

              fetch(src, { method: 'HEAD' })
                .then(req => {
                  const cd = req.headers.get('content-disposition')
                  const m = cd.match(/filename="(.*)"/)
                  const filename = m ? m[1] : 'file.jpg'

                  done(null, { src, alt, filename })
                })
            })
        }, (err, images) => {
          entry.images = images
          callback(err, entry)
        })
      })
  }
}
