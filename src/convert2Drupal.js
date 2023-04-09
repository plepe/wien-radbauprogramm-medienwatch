const path = require('path')

module.exports = function convert2Drupal (article) {
  const node = {
    type: [{ target_id: 'medienbericht' }]
  }

  node.title = [{ value: article.title }]
  node.field_datum = [{ value: article.date }]
  node.field_url = [{ uri: article.url }]
  node.field_medium = [{ value: 'MeinBezirk.at' }]

  node.field_content_body = [{ value: article.content, format: 'basic_html' }]

  node.field_content_images = article.images.map(img => {
    return {
      target_type: 'fileUpload',
      data: {
        filename: path.basename(img.src),
        src: img.src
      },
      target_id: null,
      alt: img.alt
    }
  })

  return node
}
