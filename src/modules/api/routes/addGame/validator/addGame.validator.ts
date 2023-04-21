import { Validator } from '@localtypes/validator.type'
import { z } from 'zod'

export class AddGameValidator implements Validator {
  public validate(data: unknown) {
    const schema = z.object({
      title: z.string(),
      steam_url: z
        .string()
        .regex(/^https:\/\/store\.steampowered\.com\/app\/[0-9]{1,7}\/\w+\/?$/),
      nuuvem_url: z
        .string()
        .regex(/^https:\/\/www.nuuvem.com\/(br-en|br-pt)\/item\/[\w-]+\/?$/)
        .optional()
    })

    const validation = schema.safeParse(data)
    if (validation.success) return { success: true }

    return { success: false, errors: validation.error.issues as unknown }
  }
}
