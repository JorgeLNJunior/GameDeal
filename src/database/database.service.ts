import { promises as fs } from 'fs'
import { FileMigrationProvider, Kysely, Migrator, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import * as path from 'path'
import { singleton } from 'tsyringe'

import { Logger } from '../infra/logger'
import ConfigService from '../services/config.service'
import { Database } from './interfaces/database.interface'

@singleton()
export class DatabaseService {
  private client!: Kysely<Database>

  constructor(private config: ConfigService, private logger: Logger) {}

  /**
   * Connect to the database and run all pending migrations.
   *
   * ```
   * await new DatabaseService().connect()
   * ```
   */
  public async connect() {
    this.client = new Kysely<Database>({
      dialect: new MysqlDialect({
        pool: createPool({
          host: this.config.getEnv('DB_HOST'),
          database: this.config.getEnv('DB_NAME'),
          port: this.config.getEnv('DB_PORT'),
          user: this.config.getEnv('DB_USER'),
          password: this.config.getEnv('DB_PASSWORD')
        })
      })
    })
    await this.migrate()
  }

  /**
   * Disconnect from the database.
   *```
   * await db.disconnect()
   * ```
   */
  async disconnect(): Promise<void> {
    return this.client.destroy()
  }

  /**
   * Get the database client instance.
   * You MUST call `.connect()` method before get the client.
   *
   * ```
   * const db = new DatabaseService()
   * await db.connect()
   * const client = db.getClient()
   * ```
   */
  public getClient(): Kysely<Database> {
    return this.client
  }

  /**
   * Execute all pending migrations.
   *
   * ```
   * await this.migrate()
   * ```
   */
  private async migrate(): Promise<void> {
    const { error, results } = await new Migrator({
      db: this.client,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: __dirname + '/migrations'
      })
    }).migrateToLatest()

    results?.forEach((result) => {
      if (result.status === 'Success') {
        this.logger.info(
          `migration "${result.migrationName}" was executed successfully.`
        )
      } else if (result.status === 'Error') {
        this.logger.error(
          `failed to execute migration "${result.migrationName}".`
        )
      }
    })

    if (error) {
      this.logger.fatal(error, 'database migration failed')
      process.exit(1)
    }
  }
}
