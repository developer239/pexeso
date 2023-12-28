import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class User {
  @ApiProperty({
    example: 1,
    description: 'Unique user ID.',
  })
  @IsNotEmpty()
  readonly id: number

  @ApiProperty()
  @IsNotEmpty()
  readonly username: string
}
