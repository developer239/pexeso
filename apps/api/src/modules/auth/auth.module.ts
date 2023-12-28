import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { AuthService } from 'src/modules/auth/auth.service'
import { SessionController } from 'src/modules/auth/controllers/session.controller'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'
import { UsernameAuthGuard } from 'src/modules/auth/guards/username.guard'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

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
    TypeOrmModule.forFeature([User, Game, GamePlayer]),
  ],
  controllers: [SessionController],
  providers: [
    DoesNotExist,
    AuthService,
    JwtStrategy,
    UsersRepository,
    UsernameAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
