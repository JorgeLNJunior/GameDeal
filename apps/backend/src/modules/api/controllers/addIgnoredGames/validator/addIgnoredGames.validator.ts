import type { ValidationResult, Validator } from '@localtypes/validator.type'

import type { AddIgnoredGamesDto } from '../dto/addIgnoredGames.dto'

export class AddIgnoredGamesValidator implements Validator {
  public validate (data: AddIgnoredGamesDto): ValidationResult {
    const errors: string[] = []

    if (!Array.isArray(data.titles)) {
      errors.push('"titles" should be an array')
    } else {
      for (const title of data.titles) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (typeof title !== 'string') errors.push(`"${title}" should be a string`)
      }
    }

    if (errors.length === 0) return { success: true }

    return { success: false, errors }
  }
}
