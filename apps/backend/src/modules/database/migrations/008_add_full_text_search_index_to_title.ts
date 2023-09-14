import { type Kysely, sql } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  // drop the old index
  await db.schema.dropIndex('game_title_index').on('game').execute()

  await sql`CREATE FULLTEXT INDEX game_title_full_text_index ON game(title)`.execute(db)
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .dropIndex('game_title_full_text_index')
    .on('game')
    .execute()

  // recreate the old index
  await db.schema
    .createIndex('game_title_index')
    .on('game')
    .column('title')
    .execute()
}
