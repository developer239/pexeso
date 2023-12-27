import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator'
import { UserRole } from 'src/modules/auth/roles/roles.types'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

export class UpdateUserRequestDTO {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(DoesNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  readonly email?: string | undefined

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  readonly password?: string

  @ApiProperty()
  @IsOptional()
  readonly firstName?: string | undefined

  @ApiProperty()
  @IsOptional()
  readonly lastName?: string | undefined

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  readonly role?: UserRole | undefined
}
