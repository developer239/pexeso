/* eslint-disable security/detect-object-injection */
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  rand,
  randEmail,
  randFirstName,
  randLastName,
  randPassword,
} from '@ngneat/falso'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { User } from 'src/modules/auth/entities/user.entity'
import { UserRole } from 'src/modules/auth/roles/roles.types'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Injectable()
export class UserTestingService extends TestingEntityService {
  public createUserData() {
    return {
      email: randEmail(),
      password: randPassword(),
      firstName: randFirstName(),
      lastName: randLastName(),
    }
  }

  public async createTestUser() {
    const email = randEmail()
    const password = randPassword()
    const firstName = randFirstName()
    const lastName = randLastName()
    const role = rand([UserRole.USER, UserRole.ADMIN])

    const user = await this.saveFixture(User, {
      email,
      password,
      firstName,
      lastName,
      role,
    })

    return {
      user,
      meta: {
        plainPassword: password,
      },
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
    role: UserRole = UserRole.USER,
    shouldNotSerialize = false
  ) {
    const { user } = await this.createTestUser()
    user.role = role // Assign role to the user
    await user.save()

    const accessToken = jwtService.sign({ id: user.id, roleId: user.role })

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
