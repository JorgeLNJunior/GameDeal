import { type Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema.createIndex('game_price_drop_date_index')
    .on('game_price_drop')
    .column('date')
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('game_price_drop_date_index').execute()
}
