import { PartialType } from '@nestjs/swagger'
import { UserDTO } from 'src/modules/auth/dto/user.dto'

export class MeDTO extends PartialType(UserDTO) {}
