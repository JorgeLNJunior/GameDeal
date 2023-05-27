import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { FindGameByIdRepository } from '@modules/shared/repositories/findGameById.repository'
import { FakeCache } from '@testing/fakes/fake.cache'
import { container } from 'tsyringe'

import { FindGameByIdController } from './findGameById.controller'

describe('FindGameByIdController', () => {
  let controller: FindGameByIdController
  let repository: FindGameByIdRepository
  let cache: ApplicationCache

  beforeEach(async () => {
    repository = container.resolve(FindGameByIdRepository)
    cache = new FakeCache()
    controller = new FindGameByIdController(repository, cache, new PinoLogger())
  })

  it('should return a OK reponse', async () => {
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'stem_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: game.id },
      url: ''
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
  })

  it('should return OK with cache enabled', async () => {
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'stem_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: game,
      expires: 60
    })

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: game.id },
      url: ''
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK with cache disabled', async () => {
    const game = {
      id: 'id',
      title: 'title',
      steam_url: 'stem_url',
      nuuvem_url: 'nuuvem_url',
      created_at: new Date(),
      updated_at: null
    }
    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)
    const cacheSpy = jest.spyOn(cache, 'get')

    const response = await controller.handle({
      body: {},
      headers: {
        'cache-control': 'no-cache'
      },
      query: {},
      params: { id: game.id },
      url: ''
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a NOT_FOUND response if the game was not found', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce(undefined)

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' },
      url: ''
    })

    expect(response.statusCode).toBe(404)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('game not found')
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValueOnce(new Error('repository error'))

    const response = await controller.handle({
      body: {},
      headers: {},
      query: {},
      params: { id: 'id' },
      url: ''
    })

    expect(response.statusCode).toBe(500)
  })
})
