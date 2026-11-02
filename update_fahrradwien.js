const fs = require('fs')
const async = require('async')
const loadDocument = require('./src/loadDocument.js')
const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const drupal = require('./src/drupal')

const list = JSON.parse(fs.readFileSync('medienberichte.json'))

let fw_list = list.filter(item => item.field_url.match(/^https:\/\/www\.fahrradwien\.at\//))
console.log(fw_list.length)
//fw_list = fw_list.slice(0, 5)

const update = []

//async.eachSeries(fw_list, (item, done) => {
//  fetch(item.field_url)
//    .then(req => {
//      if (req.url === 'https://mobilitaetsagentur.at/') {
//        console.log(item.id, item.field_url, req.url)
//        update.push(item.id)
//      }
//      return req
//    })
//    .then(body => {
//      done()
//    })
//}, (err) => {
//  fs.writeFileSync('fahrradwien_to_update.json', JSON.stringify(update))
//})
drupal.whenLoggedIn((err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  // update_node(2562, (err) => console.error(err))
  const list = JSON.parse(fs.readFileSync('fahrradwien_to_update.json'))
  async.eachSeries(list, (id, done) => {
    update_node(id, done)
  })
})

function update_node (id, callback) {
  drupal.nodeGet(id, {}, (err, body) => {
      if (body.field_content_body.length) {
      //  console.log('skip', id)
        return callback()
      }

      console.log(id)
      const update = {
        type: body.type,
        field_url: body.field_url,
        field_content_images: []
      }

      const url = body.field_url[0].uri
      fetch('https://web.archive.org/web/20260000000000/' + url)
        .then(req => {
          update.field_url.push({ uri: req.url })
          return req.text()
        })
        .then(body => {
          const dom = new JSDOM(body)
          const document = dom.window.document

          let content = Array.from(document.querySelectorAll('.content-element.text')).map(div => div.outerHTML).join('\n')

          update.field_content_body = [{
            format: 'basic_html',
            value: content
          }]

          let images = Array.from(document.querySelectorAll('.content-element.text img')).map(img => {
            return {
              src: img.src,
              alt: img.alt
            }
          })
          images = images.concat(Array.from(document.querySelectorAll('.content-element.gallery a')).map(a => {
            return {
              src: a.href,
              alt: a.getAttribute('title')
            }
          }))

//          images = images.map(img => {
//            img.src = img.src.replace('mobilitaetsagentur.at', 'fahrradwien.at')
//            img.src = img.src.replace('wienzufuss.at', 'fahrradwien.at')
//            return img
//          })

          update.field_content_images = images.map(img => {
            const m = img.src.match(/^https:\/\/web\.archive\.org\/web\/[A-Za-z_0-9]+\/(https:.*)$/)
            const url = m[1]

            return {
              target_type: 'fileUpload',
              data: {
                filename: path.parse(url).base,
                src: url
              },
              alt: img.alt
            }
          })

          console.log(JSON.stringify(update, null, '  '))
          drupal.nodeSave(id, update, {}, (err) => {
            console.log(err)
            callback()
          })
        })
  })
}
