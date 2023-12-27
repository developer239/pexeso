import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  create(username: string) {
    const newUser = this.usersRepository.create({ username })
    return this.usersRepository.save(newUser)
  }

  findOne(fields: FindOptionsWhere<User>, relations?: string[]) {
    return this.usersRepository.findOne({
      where: fields,
      relations,
    })
  }

  updateLastActiveAt(userId: number) {
    return this.usersRepository.update(userId, {
      lastActive: new Date(),
    })
  }
}
