/* eslint-disable jsdoc/require-jsdoc */
import { Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('game_price')
    .addColumn('gamers_gate_price', 'decimal(15, 2)', (col) =>
      col.defaultTo(null)
    )
    .execute()
}

export async function down(db: Kysely<unknown>) {
  await db.schema
    .alterTable('game_price')
    .dropColumn('gamers_gate_price')
    .execute()
}
