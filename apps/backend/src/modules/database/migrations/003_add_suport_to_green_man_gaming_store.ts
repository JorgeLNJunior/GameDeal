import { type Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('game')
    .addColumn('green_man_gaming_url', 'varchar(255)')
    .execute()
  await db.schema
    .alterTable('game_price')
    .addColumn('green_man_gaming_price', 'decimal(15, 2)')
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('game').dropColumn('green_man_gaming_url').execute()
  await db.schema.alterTable('game_price').dropColumn('green_man_gaming_price').execute()
}
