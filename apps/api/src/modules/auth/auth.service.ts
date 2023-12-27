import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { DeepPartial } from 'typeorm'
import { RegisterRequestDTO } from 'src/modules/auth/dto/register.dto'
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

  async validateUserByEmailPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersRepository.findOne({ email })

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user?.password)
      if (isValidPassword) {
        return user
      }
    }

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
    const token = this.jwtService.sign({
      id: user.id,
      roleId: user.role,
    })
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        roleId: user.role,
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

  async register(dto: RegisterRequestDTO): Promise<void> {
    await this.usersRepository.create({
      ...dto,
    })
  }

  refreshAccessToken(user: User) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      roleId: user.role,
    })

    return { accessToken }
  }

  findUsers(paginationOptions: { offset: number; limit: number }) {
    return this.usersRepository.findManyWithPagination(paginationOptions)
  }

  async updateUser(id: number, payload: DeepPartial<User>) {
    const result = await this.usersRepository.update(id, payload)
    if (!result) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'userNotFound',
        },
        HttpStatus.NOT_FOUND
      )
    }

    return result
  }

  async deleteUser(id: number) {
    const hasDeleted = await this.usersRepository.softDelete(id)

    if (!hasDeleted) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'userNotFound',
        },
        HttpStatus.NOT_FOUND
      )
    }
  }
}
