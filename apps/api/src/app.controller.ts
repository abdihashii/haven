import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service.js'
import { CurrentUser, Public, Session } from './auth/decorators.js'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('protected')
  getProtected(@Session() session: unknown, @CurrentUser() user: unknown) {
    return { session, user }
  }
}
