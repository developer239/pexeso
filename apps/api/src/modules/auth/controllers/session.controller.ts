import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from 'src/modules/auth/auth.service'
import { RefreshTokenResponseDTO } from 'src/modules/auth/dto/refresh-token.dto'
import {
  UsernameLoginRequestDTO,
  UsernameLoginResponseDTO,
} from 'src/modules/auth/dto/username-login.dto'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsernameAuthGuard } from 'src/modules/auth/guards/username.guard'
import { GetUserPayload } from 'src/modules/auth/strategies/user.decorator'
import { IpAddress } from 'src/utils/decorators/ip-address.decorator'

@ApiTags('Session')
@Controller({
  path: 'session',
  version: '1',
})
export class SessionController {
  constructor(public service: AuthService) {}

  @UseGuards(UsernameAuthGuard)
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('username')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UsernameLoginResponseDTO,
  })
  public login(
    @Body() login: UsernameLoginRequestDTO,
    @GetUserPayload() user: User,
    @IpAddress() ipAddress
  ) {
    return this.service.login(user, ipAddress)
  }

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('refresh')
  @ApiOkResponse({
    type: RefreshTokenResponseDTO,
  })
  public refreshToken(@GetUserPayload() user: User): { accessToken: string } {
    return this.service.refreshAccessToken(user)
  }
}
