const async = require('async')
const childProcess = require('child_process')
const fs = require('fs')
const config = require('../config.json')
const getSel = require('./getSel.js')
const getSelAttr = getSel.attr
const getTempDir = require('./getTempDir')

module.exports = class NewspaperYoutube {
  title () {
    return 'Youtube'
  }

  matchUrlDocument ({url}) {
    return !!url.match(/^https:\/\/((www\.|)youtube\.com|youtu\.be)\//)
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const [ fsPath, tmpDir ] = getTempDir()

    childProcess.execFile('yt-dlp', [url, '-o', 'video.mp4', '--write-description', '-S', 'res,ext:mp4:m4a', '--recode', 'mp4', '-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]'], {
      cwd: fsPath
    },
    (err) => {
      if (err) { return callback(err) }

      const entry = {
        url: getSelAttr(document, 'link[rel=canonical]', 'href'),
        title: getSelAttr(document, 'meta[name=title]', 'content'),
        medium: getSelAttr(document, 'link[itemprop=name]', 'content'),
        date: getSelAttr(document, 'meta[itemprop=datePublished]', 'content'),
        type: 'social_media',
      }

      entry.videos = [{ tmpPath: tmpDir + 'video.mp4', src: 'video.mp4' }]

      async.parallel([
        (done) => fs.readFile(fsPath + 'video.description', (err, content) => {
          if (err) { return callback(err) }

          entry.content = content.toString()
          done()
        })
      ], (err) => this.cleanUp(() => callback(err, entry)))
    })
  }

  cleanUp (callback) {
    async.parallel([
//      (done) => fs.unlink(fsPath + 'video.mp4', done),
//      (done) => fs.unlink(fsPath + 'video.description', done)
    ], callback)
  }
}
