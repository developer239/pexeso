import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/modules/auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      // TODO: remove this field if possible
      passwordField: '',
    })
  }

  async validate(username: string): Promise<any> {
    const user = await this.authService.validateUserByUsername(username)
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: `unauthorized`,
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    return user
  }
}
