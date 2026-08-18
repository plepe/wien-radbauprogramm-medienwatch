function getSelAttr (document, selector, attribute) {
  const sel = document.querySelector(selector)
  if (!sel) {
    return undefined
  }

  return sel.getAttribute(attribute)
}

function getSelText (document, selector) {
  const sel = document.querySelector(selector)
  if (!sel) {
    return undefined
  }

  return sel.textContent.trim()
}

module.exports = {
  attr: getSelAttr,
  text: getSelText
}
