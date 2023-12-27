import { ConfigType, registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const databaseConfigSchema = {
  DATABASE_URL: Joi.string().required(),
}

export const databaseConfig = registerAs('database', () => ({
  databaseUrl: process.env.DATABASE_URL,
}))

export type DatabaseConfigType = ConfigType<typeof databaseConfig>
