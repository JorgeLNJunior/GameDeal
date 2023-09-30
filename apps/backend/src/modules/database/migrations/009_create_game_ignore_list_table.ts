import { type Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('game_ignore_list')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().notNull())
    .addColumn('title', 'varchar(255)', (col) => col.notNull().unique())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('game_ignore_list').ifExists().execute()
}
