import { Test } from '@nestjs/testing'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import type { TestingModule } from '@nestjs/testing'

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
  Session: () => () => {},
}))

describe('appController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello, World!"', () => {
      expect(appController.getHello()).toBe('Hello, World!')
    })
  })

  describe('protected', () => {
    it('should return session and user', () => {
      const mockSession = {
        session: {
          id: 'session-123',
          userId: 'user-456',
          token: 'mock-token',
          expiresAt: new Date(),
        },
        user: {
          id: 'user-456',
          email: 'test@example.com',
          name: 'Test User',
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }

      const result = appController.getProtected(mockSession as any)

      expect(result).toEqual({
        session: mockSession,
        user: mockSession.user,
      })
    })
  })
})
