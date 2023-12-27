import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { UserDTO } from 'src/modules/auth/dto/user.dto'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'

export class UsernameLoginRequestDTO {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  readonly username: string
}

export class UsernameLoginResponseDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly accessToken: string

  @ApiProperty()
  @IsNotEmpty()
  readonly refreshToken: string

  @ApiProperty()
  readonly user: UserDTO
}
