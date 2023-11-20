import type { ValidationResult, Validator } from '@localtypes/validator.type'
import { injectable } from 'tsyringe'

import { type RemoveIgnoredGamesDto } from '../dto/removeIgnoredGames.dto'
import { IsIgnoredGameExistsRepository } from '../repositories/isIgnoredGameExists.repository'

@injectable()
export class RemoveIgnoredGamesValidator implements Validator {
  constructor (private readonly isIgnoredExistsRepository: IsIgnoredGameExistsRepository) {}

  async validate (data: RemoveIgnoredGamesDto): Promise<ValidationResult> {
    const errors: string[] = []

    if (data.removeIds == null) {
      errors.push('"removeIds" is required')
    } else {
      for (const id of data.removeIds) {
        const isIgnoredExists = await this.isIgnoredExistsRepository.exists(id)
        if (!isIgnoredExists) errors.push(`the id "${id}" do not exist`)
      }
    }

    if (errors.length === 0) return { success: true }

    return { success: false, errors }
  }
}
