#!/usr/bin/env node
const fs = require('fs')
const ArgumentParser = require('argparse').ArgumentParser
const http = require('http')
const loadUrl = require('./src/loadUrl')
const configFile = require('./config.json')

const defaultConfig = {
  port: 8080,
  ip: '0.0.0.0'
}

const contentTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/js'
}

const parser = new ArgumentParser({
  add_help: true,
  description: 'Starts a server, which takes media article URLs as request (GET parameter "url") and returns JSON objects with the content.'
})

parser.add_argument('--port', '-p', {
  help: 'Port to listen on (default: ' + defaultConfig.port + ').',
  default: defaultConfig.port
})

parser.add_argument('--ip', {
  help: 'IP to listen on (default: all available IPs).',
  default: defaultConfig.ip
})

const config = { ...parser.parse_args() }

const server = http.createServer(handleRequest)

server.listen(config.port, config.ip)

function handleRequest (request, response) {
  let url
  const timeStamp = Date.now()
  const logMsg = {
    date: new Date().toISOString(),
    ip: request.socket.remoteAddress,
    method: request.method
  }

  const reqUrl = new URL('http://localhost' + request.url)

  if (reqUrl.pathname !== '/' || !reqUrl.search) {
    // serve local file
    return serveFile(reqUrl.pathname, handleResult)
  }

  if (reqUrl.searchParams.has('url')) {
    url = reqUrl.searchParams.get('url')
  }

  logMsg.url = url
  loadUrl(url, (err, result) => {
    result = JSON.stringify(result, null, '  ')
    handleResult(err, result)
  })

  function handleResult (err, result, httpHeaders = {}) {
    logMsg.duration = Date.now() - timeStamp

    if (err) {
      logMsg.status = 400
      response.writeHead(400, {
        'Content-Type': 'text/html; charset=utf-8',
        // 'Access-Control-Allow-Origin': '*'
      })

      logMsg.error = err.message

      log(logMsg)
      return response.end(err.message)
    }

    logMsg.status = 200
    // httpHeaders['Access-Control-Allow-Origin'] = '*'
    response.writeHead(200, httpHeaders)

    log(logMsg)
    response.end(result)
  }
}

function serveFile (path, callback) {
  let srvPath = 'server'
  if (path === '/') {
    path = '/index.html'
  }

  if (path.substr(0, 5) === '/tmp/') {
    srvPath = configFile.tmpDir
    path = path.substr(4)
  }

  if (path.includes('..')) {
    return callback(new Error('illegal path ' + path))
  }

  const m = path.match(/\.([a-z]+)$/)
  const ext = m ? m[1] : ''

  fs.readFile(srvPath + path, (err, content) => {
    if (err) { return callback(err) }

    callback(null, content, {
      'Content-Type': (contentTypes[ext] ?? 'text/plain') + '; charset=utf-8'
    })
  })
}

function log (msg) {
  console.log(JSON.stringify(msg))
}
