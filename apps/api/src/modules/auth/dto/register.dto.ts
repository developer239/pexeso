import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator'
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer'
import { DoesNotExist } from 'src/utils/validators/does-not-exist.validator'

export class RegisterRequestDTO {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(DoesNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  readonly email: string

  @ApiProperty() @MinLength(6) readonly password: string

  @ApiProperty() @IsNotEmpty() readonly firstName: string

  @ApiProperty() @IsNotEmpty() readonly lastName: string
}
