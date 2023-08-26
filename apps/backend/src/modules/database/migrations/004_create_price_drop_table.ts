import { type Kysely, sql } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema.createTable('game_price_drop')
    .ifNotExists()
    .addColumn('id', 'varchar(36)', (col) => col.primaryKey().notNull())
    .addColumn('game_id', 'varchar(36)', (col) =>
      col.notNull().references('game.id').onDelete('cascade')
    )
    .addColumn('platform', 'varchar(25)', (col) => col.notNull())
    .addColumn('old_price', 'decimal(15, 2)', (col) => col.notNull())
    .addColumn('discount_price', 'decimal(15, 2)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(null).modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('game_price_drop').ifExists().execute()
}
