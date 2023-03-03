import { sql } from 'kysely'
import { container } from 'tsyringe'

import { DatabaseService } from '../../database/database.service'
import { AddGameDTO } from './dto/addGame.dto'
import { GameRepository } from './game.repository'

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
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(db.getClient())
    })

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

  describe('insertPrice', () => {
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(db.getClient())
      await sql`DELETE FROM game_price`.execute(db.getClient())
    })

    it('should insert a new game price', async () => {
      const game = await repository.create({
        title: 'Cyberpunk 2077',
        steam_url: 'https://steamcommunity.com/id',
        green_man_gaming_url: 'https://www.greenmangaming.com/id',
        nuuvem_url: 'https://nuuvem.com/id'
      })

      const price = await repository.insertPrice(game.id, {
        steam_price: 100
      })

      expect(price.steam_price).toBe('100.00')
    })
  })

  describe('find', () => {
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(db.getClient())
    })

    it('should return a list of games', async () => {
      const game = await repository.create({
        title: 'Cyberpunk 2077',
        steam_url: 'https://steamcommunity.com/id',
        green_man_gaming_url: 'https://www.greenmangaming.com/id',
        nuuvem_url: 'https://nuuvem.com/id'
      })

      const games = await repository.find()

      expect(games[0]).toEqual(game)
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(db.getClient())
    })

    it('should return a game', async () => {
      const game = await repository.create({
        title: 'Cyberpunk 2077',
        steam_url: 'https://steamcommunity.com/id',
        green_man_gaming_url: 'https://www.greenmangaming.com/id',
        nuuvem_url: 'https://nuuvem.com/id'
      })

      const result = await repository.findById(game.id)

      expect(result).toEqual(game)
    })
  })

  describe('getPrice', () => {
    afterEach(async () => {
      await sql`DELETE FROM game`.execute(db.getClient())
      await sql`DELETE FROM game_price`.execute(db.getClient())
    })

    it('should return a game price', async () => {
      const game = await repository.create({
        title: 'Cyberpunk 2077',
        steam_url: 'https://steamcommunity.com/id',
        green_man_gaming_url: 'https://www.greenmangaming.com/id',
        nuuvem_url: 'https://nuuvem.com/id'
      })
      await repository.insertPrice(game.id, {
        steam_price: 100
      })

      const result = await repository.getPrice(game.id)

      expect(result?.steam_price).toEqual('100.00')
    })
  })
})
