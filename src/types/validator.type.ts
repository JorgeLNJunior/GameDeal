export interface Validator {
  validate(data: unknown): ValidationReturn
}

interface ValidationReturn {
  success: boolean
  errors?: string[]
}
