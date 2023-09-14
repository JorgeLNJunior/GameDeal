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
      .select(['id', 'date'])
      .where('game_id', '=', game.id)
      .orderBy('date', 'asc')
      .execute()

    for (let i = 0; i < prices.length; i++) {
      const currentDay = new Date(prices[i].date).getUTCDate()
      const currentMonth = new Date(prices[i].date).getUTCMonth()
      const currentYear = new Date(prices[i].date).getUTCFullYear()

      for (let j = i + 1; j < prices.length; j++) {
        const nextDay = new Date(prices[j].date).getUTCDate()
        const nextMonth = new Date(prices[j].date).getUTCMonth()
        const nextYear = new Date(prices[j].date).getUTCFullYear()

        const isSameDay =
          currentDay === nextDay &&
          currentMonth === nextMonth &&
          currentYear === nextYear

        if (isSameDay) {
          await client
            .deleteFrom('game_price')
            .where('id', '=', prices[j].id)
            .execute()
          prices[j].date = '1990-01-01' // prevents unnecessary checks.
        } else break // prices are sorted. Next day won't be equal. Prevents unnecessary checks.
      }
    }
  }
  await db.disconnect()
}

;void (async () => {
  await deleteDuplicatedPrices()
})()
