const fs = require('fs')
const async = require('async')
const childProcess = require('child_process')
const config = require('../config.json')
const getTempDir = require('./getTempDir')

module.exports = class NewspaperOrfTvThek {
  title () {
    return 'ORF'
  }

  match (url) {
    return !!url.match(/^https:\/\/(on|tvthek)\.orf\.at\//)
  }

  loadArticle (url, node, callback) {
    const [ fsPath, tmpDir ] = getTempDir()
    const result = { url }

    async.waterfall([
      (done) => childProcess.execFile('yt-dlp', [url, '-o', 'video.mp4', '--no-playlist', '-S', 'res,ext:mp4:m4a', '--recode', 'mp4', '-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]'], {
          cwd: fsPath
        },
        (err) => done(err)),
      (done) => {
        result.videos = [{ tmpPath: tmpDir + 'video.mp4', src: 'video.mp4' }]
        done()
      }
      ], (err) => this.cleanUp(() => callback(err, result))
    )
  }

  cleanUp (callback) {
    callback()
    // fs.unlink(config.tmpDir + '/video.mp4', callback)
  }
}
