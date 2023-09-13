import ConfigService from '@config/config.service'
import { PINO_LOGGER } from '@dependencies/dependency.tokens'
import { ApplicationLogger } from '@localtypes/logger.type'
import { promises as fs } from 'fs'
import { FileMigrationProvider, Kysely, Migrator, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import * as path from 'path'
import { join } from 'path'
import { inject, singleton } from 'tsyringe'

import { type Database } from './database.interface'

@singleton()
export class DatabaseService {
  private client!: Kysely<Database>

  /**
   * Handles the database connection.
   * @param config - A `ConfigService` instance.
   * @param logger - An `ApplicationLogger` instance.
   */
  constructor (
    private readonly config: ConfigService,
    @inject(PINO_LOGGER) private readonly logger: ApplicationLogger
  ) {}

  /**
   * Connects to the database and runs all pending migrations.
   *
   * ```
   * await new DatabaseService().connect()
   * ```
   */
  async connect (): Promise<void> {
    this.logger.info('[DatabaseService] connecting to the database')
    this.client = new Kysely<Database>({
      dialect: new MysqlDialect({
        pool: createPool({
          host: this.config.getEnv<string>('DB_HOST'),
          database: this.config.getEnv<string>('DB_NAME'),
          port: this.config.getEnv<number>('DB_PORT'),
          user: this.config.getEnv<string>('DB_USER'),
          password: this.config.getEnv<string>('DB_PASSWORD'),
          dateStrings: true
        })
      })
    })
    await this.migrate()
    this.logger.info('[DatabaseService] connected to the database')
  }

  /**
   * Disconnects from the database.
   * @example
   *```
   * await db.disconnect()
   * ```
   */
  async disconnect (): Promise<void> {
    this.logger.info('[DatabaseService] disconnecting from the database')
    await this.client.destroy()
    this.logger.info('[DatabaseService] disconnected from the database')
  }

  /**
   * Gets the database client instance.
   * You MUST call `.connect()` method before get the client.
   * @example
   * ```
   * const db = new DatabaseService()
   * await db.connect()
   * const client = db.getClient()
   * ```
   * @returns The database client instance.
   */
  public getClient (): Kysely<Database> {
    return this.client
  }

  /**
   * Executes all pending migrations.
   * @example
   * ```
   * await this.migrate()
   * ```
   */
  private async migrate (): Promise<void> {
    this.logger.info('[DatabaseService] executing all pending migrations')
    const { error, results } = await new Migrator({
      db: this.client,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: join(__dirname, '/migrations')
      })
    }).migrateToLatest()

    results?.forEach((result) => {
      if (result.status === 'Success') {
        this.logger.info(
          `[DatabaseService] migration "${result.migrationName}" was executed successfully.`
        )
      } else if (result.status === 'Error') {
        this.logger.error(
          `[DatabaseService] failed to execute migration "${result.migrationName}".`
        )
      }
    })

    if (error !== undefined) {
      this.logger.fatal(error, '[DatabaseService] database migration failed')
      process.exit(1)
    }
  }
}
