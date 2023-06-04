import type { ValidationResult, Validator } from '@localtypes/validator.type'

import { type UpdateGameDTO } from '../dto/updateGame.dto'

export class UpdateGameValidator implements Validator {
  public validate (data: UpdateGameDTO): ValidationResult {
    const errors: string[] = []

    if (typeof data.title !== 'string') {
      errors.push('"title" must be a string')
    }
    if (typeof data.steam_url !== 'string') {
      errors.push('"steam_url" must be a string')
    }
    if (data.steam_url != null) {
      const STEAM_REGEX = /^https:\/\/store\.steampowered\.com\/app\/[0-9]{1,7}\/\w+\/?$/
      const isValidUrl = STEAM_REGEX.test(data.steam_url)
      if (!isValidUrl) {
        errors.push('"nuuvem_url" is not a valid game url')
      }
      if (typeof data.steam_url !== 'string') {
        errors.push('"steam_url" must be a string')
      }
    }
    if (data.nuuvem_url != null) {
      const NUUVEM_REGEX = /^https:\/\/www.nuuvem.com\/(br-en|br-pt)\/item\/[\w-]+\/?$/
      const isValidUrl = NUUVEM_REGEX.test(data.nuuvem_url)
      if (!isValidUrl) {
        errors.push('"nuuvem_url" is not a valid game url')
      }
      if (typeof data.nuuvem_url !== 'string') {
        errors.push('"nuuvem_url" must be a string')
      }
    }

    if (errors.length === 0) return { success: true }

    return { success: false, errors }
  }
}