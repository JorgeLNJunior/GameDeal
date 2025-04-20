export interface Validator {
   
  validate(data: unknown): ValidationResult | Promise<ValidationResult>
}

export interface ValidationResult {
  success: boolean
  errors?: string[]
}
