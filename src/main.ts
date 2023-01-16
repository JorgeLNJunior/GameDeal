import http from 'http'

import logger from './logger'
import ConfigService from './services/config.service'

export default class Main {
  private port: number
  private configService: ConfigService

  constructor() {
    this.configService = new ConfigService()
    this.port = this.configService.getEnv<number>('PORT') || 3000
  }

  startServer() {
    const server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json')

      try {
        if (req.url !== '/') {
          res.writeHead(404)
          return res.end(
            JSON.stringify({ message: `Route "${req.url}" Not Found` })
          )
        }

        res.writeHead(200)
        return res.end(
          JSON.stringify({
            message: 'Hello World',
            handledBy: {
              processID: process.pid,
              pm2Instance:
                this.configService.getEnv<number>('INSTANCE_ID') ||
                'PM2 is not running'
            }
          })
        )
      } catch (error) {
        logger.error(JSON.stringify(error), 'Internal error')
        res.writeHead(500)
        return res.end(JSON.stringify({ message: 'Internal error' }))
      }
    })

    server.listen(this.port, undefined, () => {
      logger.info(`server listening at port ${this.port}`, 'Server')
    })

    // graceful shutdown
    process.on('SIGINT', () => {
      logger.info('closing the server...', 'Server')
      server.close((err) => process.exit(err ? 1 : 0))
    })
  }
}

new Main().startServer()
