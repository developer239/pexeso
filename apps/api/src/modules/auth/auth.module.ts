import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { AuthService } from 'src/modules/auth/auth.service'
import { SessionController } from 'src/modules/auth/controllers/session.controller'
import { UsersController } from 'src/modules/auth/controllers/users.controller'
import { RefreshTokenRepository } from 'src/modules/auth/entities/refresh-token-repository'
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'
import { JwtRefreshTokenStrategy } from 'src/modules/auth/strategies/jwt-refresh.strategy'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'
import { UsernameAuthGuard } from './guards/username.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfigType) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expires,
        },
      }),
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  controllers: [UsersController, SessionController],
  providers: [
    DoesNotExist,
    AuthService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    RefreshTokenRepository,
    UsersRepository,
    UsernameAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
