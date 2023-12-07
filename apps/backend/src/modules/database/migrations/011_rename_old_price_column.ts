import { type Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('game_price_drop')
    .renameColumn('old_price', 'previous_price')
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('game_price_drop')
    .renameColumn('previous_price', 'old_price')
    .execute()
}
