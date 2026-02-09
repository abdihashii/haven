import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module.js'
import { auth } from './auth/auth.js'

import type {
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  // Mount Better Auth handler on the Fastify instance
  const fastify = app.getHttpAdapter().getInstance()

  fastify.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      const url = new URL(request.url, `http://${request.headers.host}`)

      const headers = new Headers()
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value)
          headers.append(key, String(value))
      })

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })

      const response = await auth.handler(req)

      reply.status(response.status)
      response.headers.forEach((value, key) => reply.header(key, value))
      reply.send(response.body ? await response.text() : null)
    },
  })

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0')
}
bootstrap()
