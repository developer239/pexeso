/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity'
import { UserTestingService } from 'src/modules/auth/entities/user-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('[session] controller', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: UserTestingService
  let jwtService: JwtService

  describe('POST /username', () => {
    it('should find user by credentials', async () => {
      // Arrange
      const { user } = await testingEntityService.createTestUser()

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .post('/api/v1/session/username')
        .send({
          username: user.username,
        })

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          id: user.id,
          username: user.username,
        },
      })
    })

    describe('when user does not exist', () => {
      it('should create new user', async () => {
        // Arrange
        const user = testingEntityService.createUserData()

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/api/v1/session/username')
          .send({
            username: user.username,
          })

        // Assert
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: {
            id: expect.any(Number),
            username: user.username,
          },
        })
      })
    })
  })

  describe('POST /refresh', () => {
    it('should return access token', async () => {
      // Arrange
      const { user, accessToken: token } =
        await testingEntityService.createAuthenticatedUser(jwtService)
      const refreshToken = await testingEntityService.saveFixture(
        RefreshToken,
        {
          value: token,
          user: {
            id: user.id,
          },
        }
      )

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .post('/api/v1/session/refresh')
        .send({
          refreshToken: refreshToken.value,
        })

      // Assert
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
      })
    })
  })

  //
  //
  // setup

  beforeAll(async () => {
    app = await bootstrap({
      imports: [AuthModule],
      providers: [],
    })

    databaseService = app.get(TestingDatabaseService)
    testingEntityService = app.get(UserTestingService)
    jwtService = app.get(JwtService)
  })

  beforeEach(async () => {
    await databaseService.clearDb()
  })

  afterAll(async () => {
    await databaseService.dataSource.destroy()
  })
})
