import 'reflect-metadata'

import http from 'http'
import { container, injectable } from 'tsyringe'

import { DatabaseService } from './database/database.service'
import { Logger } from './logger'
import ConfigService from './services/config.service'

@injectable()
export default class Main {
  private port: number

  constructor(
    private dbService: DatabaseService,
    private logger: Logger,
    private configService: ConfigService
  ) {
    this.port = this.configService.getEnv<number>('PORT') || 3000
  }

  async startServer() {
    await this.dbService.connect()
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
        this.logger.error(error, 'Internal error')
        res.writeHead(500)
        return res.end(JSON.stringify({ message: 'Internal error' }))
      }
    })

    server.listen(this.port, undefined, () => {
      this.logger.info(`server listening at port ${this.port}`)
    })

    // graceful shutdown
    process.on('SIGINT', () => {
      this.logger.info('closing the server...')
      server.close((err) => process.exit(err ? 1 : 0))
    })
  }
}

container.resolve(Main).startServer()
