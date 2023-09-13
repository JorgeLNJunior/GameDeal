import { type Kysely, sql } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('game_price')
    .dropColumn('updated_at')
    .execute()
  await db.schema.alterTable('game_price')
    .renameColumn('created_at', 'date')
    .execute()
  await db.schema.alterTable('game_price')
    .modifyColumn('date', 'date', (col) =>
      col.notNull().defaultTo(sql`(CURRENT_DATE)`)
    )
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('game_price')
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(null).modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
    )
    .execute()
  await db.schema.alterTable('game_price')
    .renameColumn('date', 'created_at')
    .execute()
  await db.schema.alterTable('game_price')
    .modifyColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}
