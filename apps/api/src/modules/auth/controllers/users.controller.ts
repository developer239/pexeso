import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from 'src/modules/auth/auth.service'
import { MeDTO } from 'src/modules/auth/dto/me.dto'
import { RegisterRequestDTO } from 'src/modules/auth/dto/register.dto'
import { User } from 'src/modules/auth/entities/user.entity'
import { GetUserPayload } from 'src/modules/auth/strategies/user.decorator'

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(public service: AuthService) {}

  @Post() @HttpCode(HttpStatus.CREATED) register(
    @Body() createUserDto: RegisterRequestDTO
  ) {
    return this.service.register(createUserDto)
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: MeDTO,
  })
  public me(@GetUserPayload() user: User) {
    return user
  }
}
