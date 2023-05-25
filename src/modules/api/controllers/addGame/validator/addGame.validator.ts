import { Validator } from '@localtypes/validator.type'

import { AddGameDTO } from '../dto/addGame.dto'

export class AddGameValidator implements Validator {
  public validate(data: AddGameDTO) {
    const errors: string[] = []

    if (!data.title) {
      errors.push('"title" is required')
    }
    if (typeof data.title !== 'string') {
      errors.push('"title" must be a string')
    }
    if (!data.steam_url) {
      errors.push('"steam_url" is required')
    }
    if (typeof data.steam_url !== 'string') {
      errors.push('"steam_url" must be a string')
    }
    if (data.steam_url) {
      // eslint-disable-next-line prettier/prettier
      const steam_regex = /^https:\/\/store\.steampowered\.com\/app\/[0-9]{1,7}\/\w+\/?$/
      const isValidUrl = steam_regex.test(data.steam_url)
      if (!isValidUrl) {
        errors.push('"nuuvem_url" is not a valid game url')
      }
      if (typeof data.steam_url !== 'string') {
        errors.push('"steam_url" must be a string')
      }
    }
    if (data.nuuvem_url) {
      // eslint-disable-next-line prettier/prettier
      const nuuvem_regex = /^https:\/\/www.nuuvem.com\/(br-en|br-pt)\/item\/[\w-]+\/?$/
      const isValidUrl = nuuvem_regex.test(data.nuuvem_url)
      if (!isValidUrl) {
        errors.push('"nuuvem_url" is not a valid game url')
      }
      if (typeof data.nuuvem_url !== 'string') {
        errors.push('"nuuvem_url" must be a string')
      }
    }

    if (errors.length === 0) return { success: true }

    return { success: false, errors: errors }
  }
}
