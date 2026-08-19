const fs = require('fs')
const async = require('async')
const childProcess = require('child_process')
const sprintf = require('sprintf-js').sprintf
const config = require('../config.json')
const getTempDir = require('./getTempDir')
const getSel = require('./getSel.js')
const getSelAttr = getSel.attr
const getSelText = getSel.text

module.exports = class NewspaperOrfTvThek {
  title () {
    return 'ORF'
  }

  matchUrlDocument ({url}) {
    return !!url.match(/^https:\/\/(on|tvthek)\.orf\.at\//)
  }

  loadArticleFromDocument ({url, document}, node, callback) {
    const [ fsPath, tmpDir ] = getTempDir()
    const result = {
      url: getSelAttr(document, 'meta[property="og:url"]', 'content'),
      title: getSelText(document, 'h1.title'),
      medium: getSelText(document, 'p.profile'),
    }

    const m = getSelAttr(document, 'span.datetime-container time[datetime]', 'datetime').match(/^(\d{4})-(\d+)-(\d+)T(.*)$/)
    result.date = sprintf('%04d-%02d-%02dT%s', m[1], m[2], m[3], m[4])

    if (['Wien heute'].includes(result.medium)) {
      result.type = 'editorial'
    }

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
