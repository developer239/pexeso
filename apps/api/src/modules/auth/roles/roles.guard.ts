import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from 'src/modules/auth/entities/user.entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ])
    if (!roles.length) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const payload = request.user as User

    return roles.includes(payload?.role)
  }
}
