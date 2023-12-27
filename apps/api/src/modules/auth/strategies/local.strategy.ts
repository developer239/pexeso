import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/modules/auth/auth.service'
import { UsersRepository } from '../entities/users.repository'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository
  ) {
    super({
      usernameField: 'username',
      // TODO: remove this field if possible
      passwordField: '',
    })
  }

  async validate(username: string): Promise<any> {
    let user = await this.authService.validateUserByUsername(username)

    if (!user) {
      user = await this.usersRepository.create(username)
    }

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
