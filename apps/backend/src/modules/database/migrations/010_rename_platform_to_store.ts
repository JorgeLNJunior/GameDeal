import { Store } from '@packages/types'
import { type Kysely, sql } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  const enumValue = sql.join(Object.values(Store))
  await db.schema
    .alterTable('game_price_drop')
    .renameColumn('platform', 'store')
    .execute()
  await db.schema
    .alterTable('game_price_drop')
    .modifyColumn('store', sql`enum(${enumValue})`, (col) => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('game_price_drop')
    .renameColumn('store', 'platform')
    .execute()
  await db.schema
    .alterTable('game_price_drop')
    .modifyColumn('platform', 'varchar(25)', (col) => col.notNull())
    .execute()
}
