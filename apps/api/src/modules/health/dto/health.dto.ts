import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator'

class HealthDetail {
  @ApiProperty({ example: 'up', description: 'Status of a component.' })
  @IsNotEmpty()
  readonly status: string
}

class DatabaseHealthDetail extends PartialType(HealthDetail) {}

class InfoDetail {
  @ApiProperty()
  database: DatabaseHealthDetail
}

export class HealthDTO {
  @ApiProperty({ example: 'ok', description: 'Overall status of the system.' })
  @IsNotEmpty()
  readonly status: string

  @ApiProperty({
    description: 'Information about the status of various components.',
  })
  @IsObject()
  @ValidateNested()
  readonly info: InfoDetail

  @ApiProperty({ description: 'Error information, if any.' })
  @IsObject()
  readonly error: Record<string, unknown>

  @ApiProperty({
    description: 'Detailed status of various components.',
  })
  @IsObject()
  @ValidateNested()
  readonly details: InfoDetail
}
