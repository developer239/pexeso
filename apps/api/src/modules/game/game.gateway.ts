import { Logger } from '@nestjs/common'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import {
  WebSocketEvents,
  CreateGameRequestDto,
  LeaveGameRequestDto,
  JoinGameRequestDto,
  StartGameRequestDto,
} from 'src/modules/game/dto/game.dto'
import { Game } from 'src/modules/game/entities/game.entity'
import { GameService } from 'src/modules/game/services/game.service'

// TODO: implement global exception filter
@WebSocketGateway({
  namespace: '/games',
  cors: {
    origin: true,
  },
})
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server

  constructor(
    private readonly gameService: GameService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  afterInit(/* server: Server */) {
    // Do something special
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async pruneGames() {
    await this.gameService.pruneGames()

    const allGames = await this.gameService.getAllGames()
    this.server.emit(WebSocketEvents.ResponseAllGames, allGames)
  }

  @SubscribeMessage(WebSocketEvents.RequestAllGames)
  async handleRequestAllGames(@ConnectedSocket() client: Socket) {
    try {
      const games = await this.gameService.getAllGames()

      this.server.emit(WebSocketEvents.ResponseAllGames, games)
    } catch (error) {
      Logger.error(error.message)
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestCreateGame)
  async handleCreateGame(
    @MessageBody() data: CreateGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.createGame(data.hostId)
      const roomId = this.getGameRoomId(game.id)

      await client.join(roomId)

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)
      this.server.emit(WebSocketEvents.ResponseAllGames, [game])
    } catch (error) {
      Logger.error(error.message)
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestJoinGame)
  async handleJoinGame(
    @MessageBody() data: JoinGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      let game = await this.gameService.findGameById(data.gameId)

      // allow spectators
      if (!game.startedAt && !game.isFull() && !game.finishedAt) {
        game = await this.gameService.joinGame(data.userId, data.gameId)
      }

      const roomId = this.getGameRoomId(game.id)
      await client.join(roomId)

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)
    } catch (error) {
      Logger.error(error.message)
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestLeaveGame)
  async handleLeaveGame(
    @MessageBody() data: LeaveGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.leaveGame(data.userId, data.gameId)

      const roomId = this.getGameRoomId(data.gameId)
      await client.leave(roomId)

      if (game?.startedAt) {
        await this.gameService.passTurnToNextPlayer(data.gameId)
      }

      if (game) {
        const updatedGame = await this.gameService.findGameById(data.gameId)
        this.server
          .to(roomId)
          .emit(WebSocketEvents.ResponseGameUpdated, updatedGame)
      }

      const allGames = await this.gameService.getAllGames()
      this.server.emit(WebSocketEvents.ResponseAllGames, allGames)
    } catch (error) {
      Logger.error(error.message)
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestStartGame)
  async handleStartGame(
    @MessageBody() data: StartGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const roomId = this.getGameRoomId(data.gameId)

      const game = await this.gameService.startGame(data.userId, data.gameId)
      const games = await this.gameService.getAllGames()

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)
      this.server.emit(WebSocketEvents.ResponseAllGames, games)

      this.scheduleFinishGame(game, roomId)

      await this.scheduleAutoPassTurnToNextPlayer(game.id, roomId)
    } catch (error) {
      Logger.error(error.message)
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  // TODO: clear timeout when the game is deleted
  private async scheduleAutoPassTurnToNextPlayer(
    gameId: number,
    roomId: string
  ) {
    try {
      const game = await this.gameService.findGameById(gameId)

      if (game.finishedAt) {
        return
      }

      const nextPlayer = await this.gameService.passTurnToNextPlayer(game.id)
      const updatedGame = await this.gameService.findGameById(game.id)

      this.server
        .to(roomId)
        .emit(WebSocketEvents.ResponseGameUpdated, updatedGame)

      const millisecondsTillTurnEnd = game.getMsTillTurnEnds()
      const timeoutId = setTimeout(() => {
        this.scheduleAutoPassTurnToNextPlayer(game.id, roomId).catch((error) =>
          Logger.error(error)
        )
      }, millisecondsTillTurnEnd)

      const timeoutKey = this.getPassTurnTimeoutId(game.id, nextPlayer!.id)
      if (this.schedulerRegistry.doesExist('timeout', timeoutKey)) {
        this.schedulerRegistry.deleteTimeout(timeoutKey)
      }
      this.schedulerRegistry.addTimeout(timeoutKey, timeoutId)
    } catch (error) {
      Logger.error(error)
    }
  }

  // TODO: clear timeout when the game is deleted
  private scheduleFinishGame(game: Game, roomId: string) {
    try {
      const millisecondsTillGameEnds = game.getMsTillGameEnds()

      const handleFinishGame = async () => {
        await this.gameService.finishGame(game.id)

        const updatedGame = await this.gameService.findGameById(game.id)
        const allGames = await this.gameService.getAllGames()

        this.server
          .to(roomId)
          .emit(WebSocketEvents.ResponseGameUpdated, updatedGame)
        this.server.emit(WebSocketEvents.ResponseAllGames, allGames)
      }

      const timeoutGameEnds = setTimeout(() => {
        handleFinishGame().catch((error) => Logger.error(error))
      }, millisecondsTillGameEnds)

      this.schedulerRegistry.addTimeout(
        this.getGameEndsTimoutId(game.id),
        timeoutGameEnds
      )
    } catch (error) {
      Logger.error(error)
    }
  }

  private getPassTurnTimeoutId(gameId: number, playerId: number): string {
    return `game-${gameId}-player-${playerId}-timeout`
  }

  private getGameEndsTimoutId(gameId: number): string {
    return `game-${gameId}-end-timeout`
  }

  private getGameRoomId(gameId: number): string {
    return `game-${gameId}`
  }
}
