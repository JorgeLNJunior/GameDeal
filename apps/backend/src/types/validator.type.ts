export interface Validator {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  validate(data: unknown): ValidationResult | Promise<ValidationResult>
}

export interface ValidationResult {
  success: boolean
  errors?: string[]
}
