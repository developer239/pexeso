/* eslint-disable max-lines-per-function */
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { UserTestingService } from 'src/modules/auth/entities/user-testing.service'
import { User } from 'src/modules/auth/entities/user.entity'
import { UserRole } from 'src/modules/auth/roles/roles.types'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('[admin] controller', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: UserTestingService
  let jwtService: JwtService

  describe('GET /users', () => {
    it('should return list of users for admin', async () => {
      // Arrange
      const { accessToken } =
        await testingEntityService.createAuthenticatedUser(
          jwtService,
          UserRole.ADMIN
        )
      await testingEntityService.createTestUsers(20) // Create 20 test users

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .get('/api/v1/admin/users?offset=0&limit=5')
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(5)
    })

    describe('when not an admin', () => {
      it('should return 403 Forbidden', async () => {
        // Arrange
        const { accessToken } =
          await testingEntityService.createAuthenticatedUser(jwtService)

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .get('/api/v1/admin/users')
          .set('Authorization', `Bearer ${accessToken}`)

        // Assert
        expect(response.status).toBe(403)
      })
    })

    describe('when no access token', () => {
      it('should return 401 Unauthorized', async () => {
        // Act
        const server = app.getHttpServer()
        const response = await request(server).get('/api/v1/admin/users')

        // Assert
        expect(response.status).toBe(401)
      })
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete user and return 204 for admin', async () => {
      // Arrange
      const { accessToken } =
        await testingEntityService.createAuthenticatedUser(
          jwtService,
          UserRole.ADMIN
        )
      const { user: targetUser } = await testingEntityService.createTestUser()

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .delete(`/api/v1/admin/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(204)

      // check if user is actually deleted
      const deletedUser = await testingEntityService.findOneById(
        User,
        targetUser.id
      )

      expect(deletedUser).toBeNull()
    })

    it('should return 403 Forbidden when not an admin', async () => {
      // Arrange
      const { accessToken } =
        await testingEntityService.createAuthenticatedUser(jwtService)
      const { user: targetUser } = await testingEntityService.createTestUser()

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .delete(`/api/v1/admin/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should return 401 Unauthorized when no access token', async () => {
      // Arrange
      const { user: targetUser } = await testingEntityService.createTestUser()

      // Act
      const server = app.getHttpServer()
      const response = await request(server).delete(
        `/api/v1/admin/users/${targetUser.id}`
      )

      // Assert
      expect(response.status).toBe(401)
    })

    it('should return 404 Not Found when user does not exist', async () => {
      // Arrange
      const { accessToken } =
        await testingEntityService.createAuthenticatedUser(
          jwtService,
          UserRole.ADMIN
        )
      const nonExistentUserId = 9999999

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .delete(`/api/v1/admin/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toBe(404)
    })
  })

  describe('PATCH /users/:id', () => {
    it('should update the user and return 200 for admin', async () => {
      // Arrange
      const { accessToken } =
        await testingEntityService.createAuthenticatedUser(
          jwtService,
          UserRole.ADMIN
        )
      const { user: targetUser } = await testingEntityService.createTestUser()
      const updateUserDto = {
        firstName: 'Updated User Name',
      }

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .patch(`/api/v1/admin/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)

      // Assert
      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        id: targetUser.id,
        email: targetUser.email,
        firstName: 'Updated User Name',
        lastName: targetUser.lastName,
      })
    })

    it('should return 403 Forbidden when not an admin', async () => {
      // Arrange
      const { accessToken } =
        await testingEntityService.createAuthenticatedUser(jwtService)
      const { user: targetUser } = await testingEntityService.createTestUser()
      const updateUserDto = {
        name: 'Updated User Name',
      }

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .patch(`/api/v1/admin/users/${targetUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)

      // Assert
      expect(response.status).toBe(403)
    })

    it('should return 401 Unauthorized when no access token', async () => {
      // Arrange
      const { user: targetUser } = await testingEntityService.createTestUser()
      const updateUserDto = {
        name: 'Updated User Name',
      }

      // Act
      const server = app.getHttpServer()
      const response = await request(server)
        .patch(`/api/v1/admin/users/${targetUser.id}`)
        .send(updateUserDto)

      // Assert
      expect(response.status).toBe(401)
    })

    describe('when updating password', () => {
      it('should update the user and ensure login works', async () => {
        // Arrange
        const { accessToken } =
          await testingEntityService.createAuthenticatedUser(
            jwtService,
            UserRole.ADMIN
          )
        const { user: targetUser } = await testingEntityService.createTestUser()
        const updateUserDto = {
          password: '1234!newPassword',
        }

        // Act
        const server = app.getHttpServer()
        await request(server)
          .patch(`/api/v1/admin/users/${targetUser.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateUserDto)

        const responseLogin = await request(server)
          .post('/api/v1/session/email')
          .send({
            email: targetUser.email,
            password: updateUserDto.password,
          })

        // Assert
        expect(responseLogin.status).toBe(200)
      })
    })
  })

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
