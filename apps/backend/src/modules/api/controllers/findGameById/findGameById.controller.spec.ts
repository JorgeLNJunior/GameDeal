import { PinoLogger } from '@infra/pino.logger'
import type { ApplicationCache } from '@localtypes/http/cache.type'
import { GameBuilder } from '@packages/testing'
import { FindGameByIdRepository } from '@shared/findGameById.repository'
import { HttpRequestBuilder } from '@testing/builders/http.request.builder'
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
    const game = new GameBuilder().build()

    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)

    const request = new HttpRequestBuilder()
      .withParams({ id: game.id })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
  })

  it('should return OK with cache enabled', async () => {
    const game = new GameBuilder().build()

    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)
    const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce({
      value: game,
      expires: 60
    })

    const request = new HttpRequestBuilder()
      .withParams({ id: game.id })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
    expect(cacheSpy).toHaveBeenCalled()
  })

  it('should return OK with cache disabled', async () => {
    const game = new GameBuilder().build()

    jest.spyOn(repository, 'find').mockResolvedValueOnce(game)
    const cacheSpy = jest.spyOn(cache, 'get')

    const request = new HttpRequestBuilder()
      .withParams({ id: game.id })
      .withHeaders({ 'cache-control': 'no-cache' })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(game)
    expect(cacheSpy).not.toHaveBeenCalled()
  })

  it('should return a NOT_FOUND response if the game was not found', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce(undefined)

    const request = new HttpRequestBuilder()
      .withParams({ id: 'id' })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(404)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((response.body as any).message).toBe('game not found')
  })

  it('should return a INTERNAL_ERROR response if an exception was thrown', async () => {
    jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error())

    const request = new HttpRequestBuilder()
      .withParams({ id: 'id ' })
      .build()
    const response = await controller.handle(request)

    expect(response.statusCode).toBe(500)
  })
})
