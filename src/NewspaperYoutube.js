const child_process = require('child_process')
const fs = require('fs')

module.exports = class NewspaperYoutube {
  title () {
    return 'Youtube'
  }

  match (url) {
    return url.match(/^https:\/\/((www\.|)youtube\.com|youtu\.be)\//)
  }

  loadArticle (url, callback) {
    child_process.execFile('youtube-dl', [url, '-o', 'video.mp4', '-S', 'res,ext:mp4:m4a', '--recode', 'mp4', '-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]'], {
      cwd: '/tmp'
    },
    (err) => {
      if (err) { return callback(err) }

      fs.readFile('/tmp/video.mp4', (err, content) => {
        if (err) { return callback(err) }

        const videos = [{ content, src: 'video.mp4' }]
        const entry = { videos }

        callback(null, entry)
      })
    })
  }
}
