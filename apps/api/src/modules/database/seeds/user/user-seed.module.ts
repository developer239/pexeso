import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { UserSeedService } from 'src/modules/database/seeds/user/user-seed.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
