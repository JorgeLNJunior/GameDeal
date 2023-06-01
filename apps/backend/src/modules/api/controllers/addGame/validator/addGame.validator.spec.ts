/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AddGameDTO } from '@api/controllers/addGame/dto/addGame.dto'

import { AddGameValidator } from './addGame.validator'

describe('AddGameValidator', () => {
  it('should return true if validation succeeds', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(true)
    expect(errors).toBeUndefined()
  })

  it('should return false if title is undefined', async () => {
    const data = {
      title: undefined,
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data as any)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if steam_url is undefined', async () => {
    const data = {
      title: 'God of War',
      steam_url: undefined,
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data as any)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if title is not a string', async () => {
    const data = {
      title: 10,
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data as any)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if steam_url is not a string', async () => {
    const data = {
      title: 'God of War',
      steam_url: 10,
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data as any)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if steam_url validation fails', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'invalid url'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if nuuvem_url validation fails', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      nuuvem_url: 'invalid url'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })
})
