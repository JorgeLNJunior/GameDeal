import { GameRepository } from '@database/repositories/game.repository'
import { container } from 'tsyringe'

import { GetGameController } from './getGame.controller'

describe('GetGameController', () => {
  let controller: GetGameController
  let repository: GameRepository

  beforeEach(async () => {
    repository = container.resolve(GameRepository)
    controller = new GetGameController(repository)
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
