import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'

import type {
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  // eslint-disable-next-line node/prefer-global/process
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap()
