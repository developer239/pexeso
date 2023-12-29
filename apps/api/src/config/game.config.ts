import { ConfigType, registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const gameConfigSchema = {
  GRID_SIZE_W: Joi.number().required(),
  GRID_SIZE_H: Joi.number().required(),
  MAX_PLAYERS: Joi.number().required(),
  GAME_TIME_LIMIT_S: Joi.number().required(),
  TURN_TIME_LIMIT_S: Joi.number().required(),
  CARD_VISIBLE_TIME_S: Joi.number().required(),
}

export const gameConfig = registerAs('game', () => ({
  gridSizeW: Number(process.env.GRID_SIZE_W),
  gridSizeH: Number(process.env.GRID_SIZE_H),
  maxPlayers: Number(process.env.MAX_PLAYERS),
  gameTimeLimitS: Number(process.env.GAME_TIME_LIMIT_S),
  turnTimeLimitS: Number(process.env.TURN_TIME_LIMIT_S),
  cardVisibleTimeS: Number(process.env.CARD_VISIBLE_TIME_S),
}))

export type GameConfigType = ConfigType<typeof gameConfig>
