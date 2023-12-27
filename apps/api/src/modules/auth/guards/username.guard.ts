import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from 'src/modules/auth/auth.service'

@Injectable()
export class UsernameAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { username } = request.body

    if (!username) {
      throw new UnauthorizedException('Username is required')
    }

    const user = await this.authService.validateUserByUsername(username)
    if (!user) {
      throw new UnauthorizedException()
    }

    request.user = user

    return true
  }
}
