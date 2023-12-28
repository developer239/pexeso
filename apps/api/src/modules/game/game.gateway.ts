import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WebSocketEvents } from 'src/modules/game/dto/game.dto'
import { GameService } from 'src/modules/game/services/game.service'

@WebSocketGateway({
  namespace: '/games',
  cors: {
    origin: true,
  },
})
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server

  constructor(private readonly gameService: GameService) {}

  afterInit(/* server: Server */) {
    // Do something special
  }

  @SubscribeMessage(WebSocketEvents.RequestAllGames)
  async handleRequestAllGames(@ConnectedSocket() client: Socket) {
    try {
      const games = await this.gameService.getAllGames()
      client.emit(WebSocketEvents.ResponseAllGames, games)
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestCreateGame)
  async handleCreateGame(
    @MessageBody() hostId: number,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.createGame(hostId)
      const roomId = this.getGameRoomId(game.id)

      await client.join(roomId)

      this.server.emit(WebSocketEvents.ResponseGameCreated, game)
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  @SubscribeMessage(WebSocketEvents.RequestJoinGame)
  async handleJoinGame(
    @MessageBody() data: { userId: number; gameId: number },
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
    @MessageBody() data: { userId: number; gameId: number },
    @ConnectedSocket() client: Socket
  ) {
    try {
      await this.gameService.leaveGame(data.userId, data.gameId)
      const game = await this.gameService.findGame(data.gameId)
      const roomId = this.getGameRoomId(game.id)

      await client.leave(roomId)

      this.server.to(roomId).emit(WebSocketEvents.ResponseGameUpdated, game)
    } catch (error) {
      client.emit(WebSocketEvents.ResponseException, { message: error.message })
    }
  }

  getGameRoomId(id: number): string {
    return `game-${id}`
  }
}
