const async = require('async')
const childProcess = require('child_process')
const fs = require('fs')

module.exports = class NewspaperYoutube {
  title () {
    return 'Youtube'
  }

  match (url) {
    return url.match(/^https:\/\/((www\.|)youtube\.com|youtu\.be)\//)
  }

  loadArticle (url, callback) {
    childProcess.execFile('youtube-dl', [url, '-o', 'video.mp4', '--write-description', '-S', 'res,ext:mp4:m4a', '--recode', 'mp4', '-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]'], {
      cwd: '/tmp'
    },
    (err) => {
      if (err) { return callback(err) }

      const entry = {}
      async.parallel([
        (done) => fs.readFile('/tmp/video.mp4', (err, content) => {
          if (err) { return callback(err) }

          entry.videos = [{ content, src: 'video.mp4' }]
          done()
        }),
        (done) => fs.readFile('/tmp/video.description', (err, content) => {
          if (err) { return callback(err) }

          entry.content = content.toString()
          done()
        })
      ], (err) => callback(err, entry))
    })
  }
}
