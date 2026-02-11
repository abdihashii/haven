import 'dotenv/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  })

  await app.listen(Number(process.env.PORT) || 8787, '0.0.0.0')
}
bootstrap()
