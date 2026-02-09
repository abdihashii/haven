import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { auth } from './auth.js'
import { IS_PUBLIC_KEY } from './decorators.js'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const headers = new Headers()

    Object.entries(request.headers as Record<string, string>).forEach(([key, value]) => {
      if (value)
        headers.append(key, String(value))
    })

    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new UnauthorizedException()
    }

    request.session = session

    return true
  }
}
