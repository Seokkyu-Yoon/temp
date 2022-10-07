import '../preload'

import http from 'http'

import { app } from '@/app'
import { Logger } from '@/module/logger'

const logger = Logger()

function getPort () {
  const strPort = process.env.PORT
  const numPort = parseInt(strPort, 10)
  if (isNaN(numPort)) return strPort
  if (numPort >= 0) return numPort
  return false
}

const port = getPort()
app.set('port', port)

const server = http.createServer(app)

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `http://localhost:${addr.port}`
  logger.log('listening on', bind)
}
function onError (err) {
  if (err.syscall !== 'listen') throw err
  const bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} ${port}`

  switch (err.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`)
      break
    case 'EDDRINUSE':
      logger.error(`${bind} is already in use`)
      break
    default:
      throw err
  }
  process.exit(1)
}

server.on('listening', onListening)
server.on('error', onError)

server.listen(port)