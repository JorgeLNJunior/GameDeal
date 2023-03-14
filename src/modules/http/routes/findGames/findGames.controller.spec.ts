import { container } from 'tsyringe'

import { FindGamesController } from './findGames.controller'
import { FindGamesRepository } from './repositories/findGames.repository'

describe('FindGamesController', () => {
  let controller: FindGamesController
  let repository: FindGamesRepository

  beforeEach(async () => {
    repository = container.resolve(FindGamesRepository)
    controller = new FindGamesController(repository)
  })

  it('should return a list of games', async () => {
    const game = {
      title: 'title',
      id: 'id',
      steam_url: 'steam_url',
      green_man_gaming_url: 'green_man_gaming_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: new Date()
    }

    jest.spyOn(repository, 'find').mockResolvedValue([game])

    const response = await controller.handle()

    expect((response.body as Array<unknown>)[0]).toMatchObject(game)
  })
})
