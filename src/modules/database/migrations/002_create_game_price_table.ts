/* eslint-disable jsdoc/require-jsdoc */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('game_price')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().notNull())
    .addColumn('game_id', 'varchar(36)', (col) =>
      col.notNull().references('game.id').onDelete('cascade')
    )
    .addColumn('steam_price', 'decimal(15, 2)', (col) => col.notNull())
    .addColumn('nuuvem_price', 'decimal(15, 2)', (col) => col.notNull())
    .addColumn('green_man_gaming_price', 'decimal(15, 2)', (col) =>
      col.notNull()
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(null).modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
    )
    .execute()

  await db.schema
    .createIndex('game_id_index')
    .on('game_price')
    .column('game_id')
    .execute()
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropIndex('game_id_index').ifExists().execute()
  await db.schema.dropTable('game_price').ifExists().execute()
}
