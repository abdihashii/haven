import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from './../src/app.module'

import type { INestApplication } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'

jest.mock('./../src/auth/auth', () => ({
  auth: {},
}))

jest.mock('@thallesp/nestjs-better-auth', () => {
  class MockAuthModule {}

  return {
    AuthModule: {
      forRoot: () => ({
        module: MockAuthModule,
      }),
    },
    AllowAnonymous: () => () => {},
    Session: () => () => {},
  }
})

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello, World!')
  })
})
