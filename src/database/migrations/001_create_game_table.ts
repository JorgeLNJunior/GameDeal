import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('game')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().notNull())
    .addColumn('title', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('steam_url', 'varchar(255)', (col) => col.notNull())
    .addColumn('nuuvem_url', 'varchar(255)')
    .addColumn('green_man_gaming_url', 'varchar(255)')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(null).modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
    )
    .execute()

  await db.schema
    .createIndex('game_title_index')
    .on('game')
    .column('title')
    .execute()
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropIndex('game_title_index').ifExists().execute()
  await db.schema.dropTable('game').ifExists().execute()
}
