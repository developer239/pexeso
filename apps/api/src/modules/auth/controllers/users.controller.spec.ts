/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { UserTestingService } from 'src/modules/auth/entities/user-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('[users] controller', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: UserTestingService
  let jwtService: JwtService

  describe('POST /', () => {
    it('should register a new user', async () => {
      // Arrange
      const data = testingEntityService.createUserData()

      // Act
      const server = app.getHttpServer()
      const response = await request(server).post('/api/v1/users').send(data)

      // Assert
      expect(response.status).toBe(201)
    })

    describe('when user already exists', () => {
      it('should return 400 status code', async () => {
        // Arrange
        const {
          user: { email, password },
        } = await testingEntityService.createTestUser()

        // Act
        const server = app.getHttpServer()
        const response = await request(server).post('/api/v1/users').send({
          email,
          password,
        })

        // Assert
        expect(response.status).toBe(422)
      })
    })
  })

  describe('GET /me', () => {
    it('should return the current user', async () => {
      // Arrange
      const { user, accessToken } =
        await testingEntityService.createAuthenticatedUser(jwtService)

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    })

    describe('when invalid access token', () => {
      it('should return 401 status code', async () => {
        // Act
        const server = app.getHttpServer()
        const response = await request(server).get('/api/v1/users/me')

        // Assert
        expect(response.status).toBe(401)
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
