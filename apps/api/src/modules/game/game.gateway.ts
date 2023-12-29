/* eslint-disable @typescript-eslint/no-misused-promises */
import { SchedulerRegistry } from '@nestjs/schedule'
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
import { GameService } from 'src/modules/game/services/game.service'

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

  @SubscribeMessage(WebSocketEvents.RequestAllGames)
  async handleRequestAllGames(@ConnectedSocket() client: Socket) {
    try {
      const games = await this.gameService.getAllGames()
      this.server.emit(WebSocketEvents.ResponseAllGames, games)
    } catch (error) {
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

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameCreated, game)
      this.server.emit(WebSocketEvents.ResponseAllGames, [game])
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestJoinGame)
  async handleJoinGame(
    @MessageBody() data: JoinGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.joinGame(data.userId, data.gameId)
      const roomId = this.getGameRoomId(game.id)

      await client.join(roomId)

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestLeaveGame)
  async handleLeaveGame(
    @MessageBody() data: LeaveGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      await this.gameService.leaveGame(data.userId, data.gameId)
      const game = await this.gameService.findGame(data.gameId)

      if (game) {
        const roomId = this.getGameRoomId(game.id)
        await client.leave(roomId)

        this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)
        this.server.emit(WebSocketEvents.ResponseAllGames, [game])
      } else {
        const allGames = await this.gameService.getAllGames()
        this.server.emit(WebSocketEvents.ResponseAllGames, allGames)
      }
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestStartGame)
  async handleStartGame(
    @MessageBody() data: StartGameRequestDto,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.startGame(data.userId, data.gameId)
      const roomId = this.getGameRoomId(game.id)

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)

      const games = await this.gameService.getAllGames()
      this.server.emit(WebSocketEvents.ResponseAllGames, games)

      // handle end turn schedule
      const callbackPassTurn = async () => {
        const nextPlayer = await this.gameService.passTurnToNextPlayer(game.id)
        const updatedGame = (await this.gameService.findGame(data.gameId))!

        this.server
          .to(roomId)
          .emit(WebSocketEvents.ResponseGameUpdated, updatedGame)

        const turnEndsAt = new Date(
          game.startedAt!.getTime() + game.turnLimitSeconds * 1000
        )
        const millisecondTillTurnEnd = turnEndsAt.getTime() - Date.now()
        const timeoutPassTurn = setTimeout(
          callbackPassTurn,
          millisecondTillTurnEnd
        )

        const isTimeoutExist = this.schedulerRegistry.doesExist(
          'timeout',
          this.getPassTurnTimeoutId(game.id, nextPlayer.id)
        )
        if (isTimeoutExist) {
          this.schedulerRegistry.deleteTimeout(
            this.getPassTurnTimeoutId(game.id, nextPlayer.id)
          )
        }

        this.schedulerRegistry.addTimeout(
          this.getPassTurnTimeoutId(game.id, nextPlayer.id),
          timeoutPassTurn
        )
      }

      const turnEndsAt = new Date(
        game.startedAt!.getTime() + game.turnLimitSeconds * 1000
      )
      const millisecondTillTurnEnd = turnEndsAt.getTime() - Date.now()
      const timeoutPassTurn = setTimeout(
        callbackPassTurn,
        millisecondTillTurnEnd
      )

      const nextPlayer = await this.gameService.passTurnToNextPlayer(game.id)

      const isTimeoutExist = this.schedulerRegistry.doesExist(
        'timeout',
        this.getPassTurnTimeoutId(game.id, nextPlayer.id)
      )
      if (isTimeoutExist) {
        this.schedulerRegistry.deleteTimeout(
          this.getPassTurnTimeoutId(game.id, nextPlayer.id)
        )
      }
      this.schedulerRegistry.addTimeout(
        this.getPassTurnTimeoutId(game.id, nextPlayer.id),
        timeoutPassTurn
      )

      // Find game after you passed the turn
      const gameAfterTurnSet = (await this.gameService.findGame(data.gameId))!
      this.server
        .to(roomId)
        .emit(WebSocketEvents.ResponseGameUpdated, gameAfterTurnSet)

      // handle end game schedule
      const callbackEndGame = async () => {
        await this.gameService.endGame(game)
        const updatedGame = (await this.gameService.findGame(data.gameId))!
        const allGames = await this.gameService.getAllGames()

        this.server
          .to(roomId)
          .emit(WebSocketEvents.ResponseGameUpdated, updatedGame)
        this.server.emit(WebSocketEvents.ResponseAllGames, allGames)
      }
      const gameEndsAt = new Date(
        game.startedAt!.getTime() + game.timeLimitSeconds * 1000
      )
      const millisecondsTillGameEnds = gameEndsAt.getTime() - Date.now()

      const timeoutGameEnds = setTimeout(
        callbackEndGame,
        millisecondsTillGameEnds
      )
      this.schedulerRegistry.addTimeout(
        this.getGameEndsTimoutId(game.id),
        timeoutGameEnds
      )
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  getPassTurnTimeoutId(gameId: number, playerId: number): string {
    return `game-${gameId}-player-${playerId}-timeout`
  }

  getGameEndsTimoutId(gameId: number): string {
    return `game-${gameId}-end-timeout`
  }

  getGameRoomId(gameId: number): string {
    return `game-${gameId}`
  }
}
