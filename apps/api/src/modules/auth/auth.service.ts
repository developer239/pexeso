import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    @Inject(authConfig.KEY)
    private readonly authConfigValues: AuthConfigType
  ) {}

  async logout(user: User) {
    const userRecord = await this.usersRepository.findOne({
      username: user.username,
    })

    if (!userRecord) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'unauthorized',
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    userRecord.lastActiveAt = new Date(
      new Date().getTime() - this.authConfigValues.lastActiveThresholdMs
    )

    await this.usersRepository.save(userRecord)
  }

  async validateUserByUsername(username: string): Promise<User | null> {
    let user = await this.usersRepository.findOne({ username })

    if (!user) {
      user = await this.usersRepository.create(username)
    } else if (this.isRecentlyActive(user)) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message:
            'Username currently taken. Please, select different username or try again later.',
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    return user
  }

  async validateUserById(userId: number) {
    const user = await this.usersRepository.findOne({ id: userId })

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'unauthorized',
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    return user
  }

  async login(user: User) {
    const token = this.jwtService.sign({
      id: user.id,
    })

    await this.usersRepository.updateLastActiveAt(user.id)

    return {
      accessToken: token,
      user,
    }
  }

  isRecentlyActive(user: User) {
    const now = new Date().getTime()
    const lastActive = user.lastActiveAt.getTime()

    return now - lastActive < this.authConfigValues.lastActiveThresholdMs
  }
}
