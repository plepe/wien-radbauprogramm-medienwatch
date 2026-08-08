import async from 'async'

let textarea
let actions

const fields = {
  title: {
    key: 'title'
  },
  url: {
    key: 'field_url',
    valueKey: 'uri',
  },
  date: {
    key: 'field_datum'
  },
  content: {
    key: 'field_content_body',
    template: {
      format: 'basic_html'
    }
  }
}

global.onload = () => {
  textarea = document.getElementById('urls')
  actions = document.getElementById('actions')

  textarea.onchange = () => {
    const urls = textarea.value.split('\n')
    urls.forEach(url => checkUrl(url))

    textarea.value = ''
  }
}

function checkUrl (url) {
  const listEntry = document.createElement('li')
  actions.appendChild(listEntry)

  listEntry.appendChild(document.createTextNode(url))

  fetch('/?url=' + url)
    .then(req => req.text())
    .then(result => {
      let text
      let fun

      if (result.match(/^No newspaper module found/)) {
        fun = dataToPrepopulate
        result = { url }
        text = 'Kann Inhalt nicht laden, bitte lege Medienbericht selber an'
      } else {
        result = JSON.parse(result)

        if (result.title && result.date) {
          fun = createFromData
          text = 'Lege Inhalt an, bitte Bearbeite um Eintrag zu vervollständigen'
        } else {
          fun = dataToPrepopulate
          text = 'Kann Titel und/oder Datum nicht erkenen, bitte lege Medienbericht selber an'
        }
      }

      fun(result, (err, href) => {
        const link = document.createElement('a')
        link.href = href
        link.target = '_blank'
        link.appendChild(document.createTextNode(text))
        listEntry.appendChild(link)
      })
    })
}

function createFromData (data, callback) {
  const content = {
    type: [{'target_id': 'medienbericht'}],
  }

  async.eachOf(data, (value, key, done) => {
    if (key in fields) {
      const field = fields[key]

      const entry = field.template ?? {}
      entry[field.valueKey ?? 'value'] = value

      content[field.key] = [entry]
    }

    done()
  }, (err) => {
    if (err) { return callback(err) }

    console.log(JSON.stringify(content, null, '  '))
    //drupal.nodeSave(null, content, {}, (err, result) => {
    //  const nid = result.nid[0].value
    const nid = 1234
    const href = '/node/' + nid + '/edit'
    callback(null, href)
    //})
  })
}

function dataToPrepopulate (data, callback) {
  const parameter = []
  Object.entries(data).forEach(([key, value]) => {
    if (key in fields) {
      field = fields[key]

      parameter.push('edit[' + field.key + '][widget][0][' + (field.valueKey || 'value') + ']=' + encodeURIComponent(value))
    }
  })

  callback(null, '/node/add/medienbericht?' + parameter.join('&'))
}
