import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenRepository } from 'src/modules/auth/entities/refresh-token-repository'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

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

  async login(user: User, ipAddress: string) {
    const token = this.jwtService.sign({
      id: user.id,
    })
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '7d',
      }
    )
    await this.refreshTokenRepository.addRefreshToken(
      user.id,
      refreshToken,
      ipAddress
    )

    await this.usersRepository.updateLastActiveAt(user.id)

    return {
      accessToken: token,
      refreshToken,
      user,
    }
  }

  refreshAccessToken(user: User) {
    const accessToken = this.jwtService.sign({
      id: user.id,
    })

    return { accessToken }
  }

  isRecentlyActive(user: User) {
    const RECENTLY_ACTIVE_THRESHOLD = 5 * 60 * 1000 // 5 minutes in milliseconds
    const now = new Date().getTime()
    const lastActive = user.lastActive.getTime()

    return now - lastActive < RECENTLY_ACTIVE_THRESHOLD
  }
}
