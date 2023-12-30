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
  turnStartedAt: string

  @ApiProperty()
  turnCount: number

  @ApiProperty({ type: () => [Card] })
  matchedCards?: Card[]

  @ApiProperty()
  cardsFlippedThisTurn: number
}

export class Card {
  @ApiProperty()
  id: number

  @ApiProperty()
  image: string
}

export class GameCard {
  @ApiProperty()
  id: number

  @ApiProperty({ type: () => Card })
  card?: Card

  @ApiProperty()
  row: number

  @ApiProperty()
  col: number

  @ApiProperty()
  isMatched: boolean

  @ApiProperty({ type: () => User })
  matchedBy: User

  @ApiProperty()
  isFlipped: boolean
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

  @ApiProperty({ type: () => [GameCard] })
  cards: GameCard[]
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

export class RequestFlipCardDto {
  @ApiProperty()
  gameId: number

  @ApiProperty()
  userId: number

  @ApiProperty()
  cardId: number
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
  RequestFlipCard = 'requestFlipCard',
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
