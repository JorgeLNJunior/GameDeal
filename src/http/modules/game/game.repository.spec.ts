import 'reflect-metadata'

import { sql } from 'kysely'
import { container } from 'tsyringe'

import { DatabaseService } from '../../../../database/database.service'
import { AddGameDTO } from '../dto/addGame.dto'
import { GameRepository } from '../game.repository'

describe('GameRepository', () => {
  let repository: GameRepository
  let db: DatabaseService

  beforeEach(async () => {
    db = container.resolve(DatabaseService)
    repository = new GameRepository(db)

    await db.connect()
  })
  afterEach(async () => {
    await db.disconnect()
  })

  describe('create', () => {
    it('should create a new game', async () => {
      const data: AddGameDTO = {
        title: 'Cyberpunk 2077',
        steam_url: 'https://steamcommunity.com/id',
        green_man_gaming_url: 'https://www.greenmangaming.com/id',
        nuuvem_url: 'https://nuuvem.com/id'
      }

      const game = await repository.create(data)

      expect(game.title).toBe(data.title)
      expect(game.steam_url).toBe(data.steam_url)
    })
  })

  describe('isAlreadyInserted', () => {
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(db.getClient())
    })

    it('should return true if a game is already inserted', async () => {
      await repository.create({
        title: 'God of War',
        steam_url: 'https://steamcommunity.com/id/godofwar'
      })
      const isAlreadyInserted = await repository.isAlreadyInserted('God of War')
      expect(isAlreadyInserted).toBe(true)
    })

    it('should return false if a game is not inserted', async () => {
      const isAlreadyInserted = await repository.isAlreadyInserted('Terraria')
      expect(isAlreadyInserted).toBe(false)
    })
  })
})
