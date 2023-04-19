/* eslint-disable jsdoc/require-jsdoc */
import { Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('game')
    .addColumn('gamers_gate_url', 'varchar(255)', (col) => col.defaultTo(null))
    .execute()
}

export async function down(db: Kysely<unknown>) {
  await db.schema.alterTable('game').dropColumn('gamers_gate_url').execute()
}
