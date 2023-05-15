const twitterUnrollHtml = require('twitter-unroll-html')
const Twitter = require('twitter')
const async = require('async')
const childProcess = require('child_process')
const fs = require('fs')
const config = require('../config.json')

module.exports = class NewspaperTwitter {
  title () {
    return 'Twitter'
  }

  match (url) {
    return url.match(/^https:\/\/(www\.|)twitter\.com\//)
  }

  loadArticle (url, node, callback) {
    if (node.field_url_thread && node.field_url_thread.length) {
      url = node.field_url_thread[0].uri
    }

    const m = url.match(/https:\/\/twitter.com\/(.*)\/status\/([0-9]*)(\?.*|)$/)
    if (!m) {
      return callback(new Error("Can't parse URL: " + url))
    }
    const id = m[2]

    const twitterClient = new Twitter(config.twitter)
    const entry = {
      images: [],
      videos: []
    }

    twitterUnrollHtml.loadThread(twitterClient, id, (err, thread) => {
      if (err) { return callback(err) }

      const htmlifyOptions = {
        htmlHideImages: true
      }

      thread.forEach(tweet => {
        if (!tweet.extended_entities) {
          return
        }

        tweet.extended_entities.media.forEach(media => {
          if (['video', 'animated_gif'].includes(media.type)) {
            entry.videos.push({
              src: media.video_info.variants[0].url,
              filename: 'video.mp4'
            })
          } else {
            entry.images.push({
              src: media.media_url_https
            })
          }
        })
      })

      twitterUnrollHtml.htmlifyThread(twitterClient, thread, htmlifyOptions, (err, html) => {
        if (err) { return callback(err) }

        entry.content = html
        callback(null, entry)
      })
    })
  }

  cleanUp (callback) {
    callback(null)
  }
}
