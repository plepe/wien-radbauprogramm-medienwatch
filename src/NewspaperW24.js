const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class NewspaperW24 {
  title () {
    return 'W24'
  }

  match (url) {
    return url.match(/^https:\/\/www\.w24\.at\//)
  }

  loadArticle (url, node, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document

        const title = document.querySelector('header h1').innerHTML
        let date = document.querySelector('.content span[title]').getAttribute('title')
        date = date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)

        const m = body.match(/mediaServer\.vod \+ '\/vod\/w24\/([0-9a-zA-Z_]+\.mp4)', type:'video\/mp4'/)
        const videos = [{ src: 'https://ms02.w24.at/vod/w24/' + m[1] }]

        const content = document.querySelector('section.moduleContent')
        Array.from(content.children).forEach(p => {
          if (!['P'].includes(p.nodeName)) {
            content.removeChild(p)
          }
        })

        const entry = { title, url, date, content: content.innerHTML.trim(), videos }

        callback(null, entry)
      })
  }
}
