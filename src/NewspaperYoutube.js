const async = require('async')
const childProcess = require('child_process')
const fs = require('fs')
const config = require('../config.json')

module.exports = class NewspaperYoutube {
  title () {
    return 'Youtube'
  }

  match (url) {
    return url.match(/^https:\/\/((www\.|)youtube\.com|youtu\.be)\//)
  }

  loadArticle (url, node, callback) {
    childProcess.execFile('youtube-dl', [url, '-o', 'video.mp4', '--write-description', '-S', 'res,ext:mp4:m4a', '--recode', 'mp4', '-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]'], {
      cwd: config.tmpDir
    },
    (err) => {
      if (err) { return callback(err) }

      const entry = {}
      async.parallel([
        (done) => fs.readFile(config.tmpDir + '/video.mp4', (err, content) => {
          if (err) { return callback(err) }

          entry.videos = [{ content, src: 'video.mp4' }]
          done()
        }),
        (done) => fs.readFile(config.tmpDir + '/video.description', (err, content) => {
          if (err) { return callback(err) }

          entry.content = content.toString()
          done()
        })
      ], (err) => this.cleanUp(() => callback(err, entry)))
    })
  }

  cleanUp (callback) {
    async.parallel([
      (done) => fs.unlink(config.tmpDir + '/video.mp4', done),
      (done) => fs.unlink(config.tmpDir + '/video.description', done)
    ], callback)
  }
}
