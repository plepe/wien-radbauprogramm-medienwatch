const path = require('path')

module.exports = function convert2Drupal (newspaper, article) {
  const node = {
    type: [{ target_id: 'medienbericht' }]
  }

  node.title = [{ value: article.title }]
  node.field_datum = [{ value: article.date }]
  node.field_url = [{ uri: article.url }]
  node.field_medium = [{ value: newspaper.title() }]

  node.field_content_body = [{ value: article.content, format: 'basic_html' }]

  node.field_content_images = article.images.map(img => {
    return {
      target_type: 'fileUpload',
      data: {
        filename: img.filename ?? path.basename(img.src),
        src: img.src
      },
      target_id: null,
      alt: img.alt
    }
  })

  return node
}
