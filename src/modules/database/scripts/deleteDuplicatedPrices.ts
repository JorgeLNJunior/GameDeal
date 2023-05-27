import 'reflect-metadata'
import '@dependencies/dependency.container'

import { DatabaseService } from '@database/database.service'
import { container } from 'tsyringe'

const db = container.resolve(DatabaseService)

/**
 * Deletes duplicated prices if more than one have been registered a day.
 */
export async function deleteDuplicatedPrices (): Promise<void> {
  await db.connect()
  const client = db.getClient()
  const games = await client.selectFrom('game').select(['id']).execute()

  for (const game of games) {
    const prices = await client
      .selectFrom('game_price')
      .select(['id', 'created_at'])
      .where('game_id', '=', game.id)
      .orderBy('created_at', 'asc')
      .execute()

    for (let i = 0; i < prices.length; i++) {
      const currentDay = prices[i].created_at.getUTCDate()
      const currentMonth = prices[i].created_at.getUTCMonth()
      const currentYear = prices[i].created_at.getUTCFullYear()

      for (let j = i + 1; j < prices.length; j++) {
        const nextDay = prices[j].created_at.getUTCDate()
        const nextMonth = prices[j].created_at.getUTCMonth()
        const nextYear = prices[j].created_at.getUTCFullYear()

        const isSameDay =
          currentDay === nextDay &&
          currentMonth === nextMonth &&
          currentYear === nextYear

        if (isSameDay) {
          await client
            .deleteFrom('game_price')
            .where('id', '=', prices[j].id)
            .execute()
          prices[j].created_at = new Date('1990-01-01') // prevents unnecessary checks.
        } else break // prices are sorted. Next day will not be equal. Prevents unnecessary checks.
      }
    }
  }
  await db.disconnect()
}

;void (async () => {
  await deleteDuplicatedPrices()
})()
