import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randUserName } from '@ngneat/falso'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { User } from 'src/modules/auth/entities/user.entity'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Injectable()
export class UserTestingService extends TestingEntityService {
  public createUserData() {
    return {
      username: randUserName(),
    }
  }

  public async createTestUser() {
    const username = randUserName()

    const user = await this.saveFixture(User, {
      username,
      lastActive: new Date(Date.now() - 20 * 60 * 1000),
    })

    return {
      user,
    }
  }

  public async createTestUsers(count: number): Promise<User[]> {
    const users: User[] = []

    await Promise.all(
      Array(count)
        .fill(0)
        .map(async () => {
          const { user } = await this.createTestUser()
          users.push(user)
        })
    )

    return users
  }

  public async createAuthenticatedUser(
    jwtService: JwtService,
    shouldNotSerialize = false
  ) {
    const { user } = await this.createTestUser()
    await user.save()

    const accessToken = jwtService.sign({ id: user.id })

    if (shouldNotSerialize) {
      return {
        user,
        accessToken,
      }
    }

    return {
      user: instanceToPlain(plainToInstance(User, user, { groups: ['me'] }), {
        groups: ['me'],
      }),
      accessToken,
    }
  }
}
