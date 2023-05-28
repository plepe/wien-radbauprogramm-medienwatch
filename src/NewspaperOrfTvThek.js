const fs = require('fs')
const async = require('async')
const childProcess = require('child_process')
const config = require('../config.json')

module.exports = class NewspaperOrfTvThek {
  title () {
    return 'W24'
  }

  match (url) {
    return url.match(/^https:\/\/tvthek\.orf\.at\//)
  }

  loadArticle (url, node, callback) {
    const displayId = url.match(/\/([0-9]+)$/)[1]
    const result = { url }

    async.waterfall([
      (done) => childProcess.execFile('youtube-dl', [url, '-o', 'video.mp4', '--no-playlist', '-S', 'res,ext:mp4:m4a', '--recode', 'mp4', '-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]'], {
          cwd: config.tmpDir
        },
        (err) => done(err)),
      (done) => fs.readFile(config.tmpDir + '/video.mp4', (err, content) => {
        if (err) { return done(err) }

        result.videos = [{ content, src: 'video.mp4' }]

        done()
      })
      ], (err) => this.cleanUp(() => callback(err, result))
    )
  }

  cleanUp (callback) {
    fs.unlink(config.tmpDir + '/video.mp4', callback)
  }
}
