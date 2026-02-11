import { Controller, Get } from '@nestjs/common'
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth'

import { AppService } from './app.service'

import type { UserSession } from '@thallesp/nestjs-better-auth'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AllowAnonymous()
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('protected')
  getProtected(@Session() session: UserSession) {
    return { session, user: session.user }
  }
}
