import { ConfigType, registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const authConfigSchema = {
  AUTH_JWT_SECRET: Joi.string().required(),
  AUTH_JWT_TOKEN_EXPIRES_IN: Joi.string().required(),
  LAST_ACTIVE_THRESHOLD_S: Joi.string().required(),
}

export const authConfig = registerAs('auth', () => ({
  secret: process.env.AUTH_JWT_SECRET,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
  lastActiveThresholdMs: Number(process.env.LAST_ACTIVE_THRESHOLD_S) * 1000,
}))

export type AuthConfigType = ConfigType<typeof authConfig>
