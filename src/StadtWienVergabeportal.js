module.exports = class StadtWienVergabeportal {
  title () {
    'Stadt Wien Vergabeportal'
  }

  match (url) {
    return !!url.match(/^https:\/\/www.wien.gv.at\/Vergabeportal\/Detail\/\d+/)
  }

  loadArticle (url, node, callback) {
    const m = url.match(/^https:\/\/www.wien.gv.at\/Vergabeportal\/Detail\/(\d+)/)
    const id = m[1]
    fetch('https://www.wien.gv.at/Vergabeportal/api/Procurement/Notice/Get/' + id)
      .then(req => req.json())
      .then(body => {
        const entry = {
          title: body.result.contractName + ' - ' + body.result.contractDescription,
          type: 'call_for_bids',
          medium: 'Stadt Wien Vergabeportal',
          date: body.result.ogdCoreData.createdAt,
          url: 'https://www.wien.gv.at/Vergabeportal/Detail/' + id
        }

        callback(null, entry)
      })
  }
}
