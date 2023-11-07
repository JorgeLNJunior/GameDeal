/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AddIgnoredGamesDto } from '../dto/addIgnoredGames.dto'
import { AddIgnoredGamesValidator } from './addIgnoredGames.validator'

describe('AddIgnoredGamesValidator', () => {
  it('should return true if validation succeeds', async () => {
    const data: AddIgnoredGamesDto = {
      titles: [
        'God of War'
      ]
    }

    const { success, errors } = new AddIgnoredGamesValidator().validate(data)

    expect(success).toBe(true)
    expect(errors).toBeUndefined()
  })

  it('should return false if "title" is not an array', async () => {
    const data: AddIgnoredGamesDto = {
      titles: { title: 'God of War' } as any
    }

    const { success, errors } = new AddIgnoredGamesValidator().validate(data)

    expect(success).toBe(false)
    expect(errors?.length).toBe(1)
  })

  it('should return false if a title is not a string', async () => {
    const data: AddIgnoredGamesDto = {
      titles: { title: 'God of War' } as any
    }

    const { success, errors } = new AddIgnoredGamesValidator().validate(data)

    expect(success).toBe(false)
    expect(errors?.length).toBeGreaterThan(0)
  })
})
