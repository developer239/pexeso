import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/modules/auth/dto/user.dto'

export class GridSize {
  @ApiProperty()
  width: number

  @ApiProperty()
  height: number
}

export class GamePlayer {
  @ApiProperty({ type: () => User })
  user: User

  @ApiProperty()
  isOnTurn: boolean

  @ApiProperty()
  turnCount: number

  @ApiProperty()
  score: number
}

export class Game {
  @ApiProperty()
  id: number

  @ApiProperty({ type: () => User })
  host: User

  @ApiProperty({ type: () => GridSize })
  gridSize: GridSize

  @ApiProperty()
  maxPlayers: number

  @ApiProperty()
  timeLimitSeconds: number

  @ApiProperty()
  turnLimitSeconds: number

  @ApiProperty()
  cardVisibleTimeSeconds: number

  @ApiProperty()
  startedAt: string

  @ApiProperty()
  finishedAt: string

  @ApiProperty({ type: () => [GamePlayer] })
  players: GamePlayer[]
}

export class CreateGameRequestDto {
  @ApiProperty()
  hostId: number
}

export class JoinGameRequestDto {
  @ApiProperty()
  userId: number

  @ApiProperty()
  gameId: number
}

export class StartGameRequestDto {
  @ApiProperty()
  userId: number

  @ApiProperty()
  gameId: number
}

export class LeaveGameRequestDto {
  @ApiProperty()
  userId: number

  @ApiProperty()
  gameId: number
}

export class ExceptionResponseDto {
  @ApiProperty()
  message: string
}

// TODO: refactor rename make keys match values
export enum WebSocketEvents {
  // Incoming
  RequestAllGames = 'requestAllGames',
  RequestCreateGame = 'createGame',
  RequestJoinGame = 'joinGame',
  RequestLeaveGame = 'leaveGame',
  RequestStartGame = 'requestStartGame',
  // Outgoing
  ResponseAllGames = 'allGames',
  ResponseGameUpdated = 'gameUpdated',
  // Errors
  ResponseException = 'exception',
}

export class WebSocketEvent {
  @ApiProperty({ enum: WebSocketEvents })
  event: WebSocketEvents
}
