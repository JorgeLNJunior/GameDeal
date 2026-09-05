import ConfigService from '@config/config.service'
import jwt from 'jsonwebtoken'
import { injectable } from 'tsyringe'

@injectable()
export class AuthService {
  private readonly SECRET

  constructor(private readonly config: ConfigService) {
    const secret = config.getEnv<string>('JWT_SECRET')
    if (secret == null) throw new Error('the enviroment variable JWT_SECRET is not set')
    this.SECRET = secret
  }

  /**
   * Generates a new JWT token.
   * @returns - A JWT token.
   */
  async getJwtToken (): Promise<string> {
    return jwt.sign({}, this.SECRET, { expiresIn: '1d' })
  }

  /**
   * Verifies if a JWT token is valid or not.
   * @param token - A JWT token to be verified.
   * @returns If the token is valid or not.
   */
  async verifyToken (token: string): Promise<JWTValidationResponse> {
    return await new Promise((resolve) => {
      jwt.verify(token, this.SECRET, (err) => {
        if (err !== null) {
          resolve({
            isValid: false,
            error: err.message
          })
        }
        resolve({
          isValid: true
        })
      })
    })
  }
}

interface JWTValidationResponse {
  isValid: boolean
  error?: string
}
