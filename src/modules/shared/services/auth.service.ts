import ConfigService from '@config/config.service'
import jwt from 'jsonwebtoken'
import { injectable } from 'tsyringe'

@injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  async getJwtToken(): Promise<string> {
    const SECRET = this.config.getEnv<string>('JWT_SECRET') as string
    return jwt.sign({}, SECRET, { expiresIn: '1d' })
  }
}
