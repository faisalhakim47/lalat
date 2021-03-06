var Promise = require('alat-promise')
var merge = require('lodash.merge')

function request(method, url, opts, cb) {
  opts = merge({
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }, opts)

  var headers = opts.headers || {}

  var req = new XMLHttpRequest()

  return Promise().resolve(cb(req)).then(function () {
    return new Promise(function (resolve) {
      req.addEventListener('load', function () {
        var result = {
          status: req.status,
          headers: req.getAllResponseHeaders()
        }

        if (!opts.headerOnly) {
          result.text = req.responseText
          if (opts.json) {
            try {
              result.json = JSON.parse(result.text)
            } catch (e) { }
          }
        }

        resolve(result)
      })

      req.open(method, url, true, opts.username, opts.password)

      Object.keys(headers).forEach(function (key) {
        req.setRequestHeader(key, headers[key])
      })

      req.send(opts.data)
    })
  })
}

function GET(url, opts, modifierFn) {
  return request('GET', url, opts, function (req) {
    if (typeof modifierFn === 'function') {
      modifierFn(req)
    }
  })
}

function POST(url, opts, data, modifierFn) {
  opts.data = data || opts.data
  return request('POST', url, opts, function (req) {
    if (typeof modifierFn === 'function') {
      modifierFn(req)
    }
  })
}

function PUT(url, opts, data, modifierFn) {
  opts.data = data || opts.data
  return request('PUT', url, opts, function (req) {
    if (typeof modifierFn === 'function') {
      modifierFn(req)
    }
  })
}

function DELETE(url, opts, modifierFn) {
  return request('DELETE', url, opts, function (req) {
    if (typeof modifierFn === 'function') {
      modifierFn(req)
    }
  })
}

function HEADER(url, opts, data, modifierFn) {
  opts.headerOnly = true
  return request('HEADER', url, opts, function (req) {
    if (typeof modifierFn === 'function') {
      modifierFn(req)
    }
  })
}

module.exports = {
  GET,
  POST,
  PUT,
  DELETE,
  HEADER
}
