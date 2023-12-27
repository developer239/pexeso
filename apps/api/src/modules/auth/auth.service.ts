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
    const user = await this.usersRepository.findOne({ username })

    // TODO: return null if user was recently active

    return null
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
    // TODO: if user doesn't exist create one
    // TODO: validate that the user was not recently active

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
}
