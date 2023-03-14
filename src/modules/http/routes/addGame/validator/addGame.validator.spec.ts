import { AddGameDTO } from '@http/routes/addGame/dto/addGame.dto'

import { AddGameValidator } from './addGame.validator'

describe('AddGameValidator', () => {
  it('should return true if validation succeeds', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      green_man_gaming_url:
        'https://www.greenmangaming.com/games/god-of-war-pc',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(true)
    expect(errors).toBeUndefined()
  })

  it('should return false if title validation fails', async () => {
    const data = {
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      green_man_gaming_url:
        'https://www.greenmangaming.com/games/god-of-war-pc',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if steam_url validation fails', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'invalid url',
      green_man_gaming_url:
        'https://www.greenmangaming.com/games/god-of-war-pc',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if green_man_gaming_url validation fails', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      green_man_gaming_url: 'ivalid url',
      nuuvem_url: 'https://www.nuuvem.com/br-en/item/god-of-war'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })

  it('should return false if nuuvem_url validation fails', async () => {
    const data: AddGameDTO = {
      title: 'God of War',
      steam_url: 'https://store.steampowered.com/app/1593500/God_of_War',
      green_man_gaming_url:
        'https://www.greenmangaming.com/games/god-of-war-pc',
      nuuvem_url: 'invalid url'
    }

    const { success, errors } = new AddGameValidator().validate(data)

    expect(success).toBe(false)
    expect(errors).toBeDefined()
  })
})
