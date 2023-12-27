import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'

@Injectable()
export class UserSeedService implements ISeedService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  public async run() {
    await this.createUser({
      username: 'Joane',
    })
    await this.createUser({
      username: 'John',
    })
  }

  private async createUser(data: any) {
    await this.repository.save(this.repository.create(data))

    Logger.log(`Created user: ${JSON.stringify(data)}`)
  }
}
