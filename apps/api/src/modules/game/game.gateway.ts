import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { GameService } from 'src/modules/game/services/game.service'

@WebSocketGateway({ namespace: '/games' })
export class GameGateway implements OnGatewayInit {
  @WebSocketServer() server: Server

  constructor(private readonly gameService: GameService) {}

  afterInit(/* server: Server */) {
    // Additional initialization logic if needed
  }

  @SubscribeMessage('createGame')
  async handleCreateGame(
    @MessageBody() hostId: number,
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.createGame(hostId)
      await client.join(`game-${game.id}`)

      this.server.emit('gameCreated', game)
    } catch (error) {
      client.emit('exception', { message: error.message })
    }
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: { userId: number; gameId: number },
    @ConnectedSocket() client: Socket
  ) {
    try {
      const game = await this.gameService.joinGame(data.userId, data.gameId)
      await client.join(`game-${game.id}`)

      this.server.to(`game-${game.id}`).emit('gameUpdated', game)
    } catch (error) {
      client.emit('exception', { message: error.message })
    }
  }

  @SubscribeMessage('leaveGame')
  async handleLeaveGame(
    @MessageBody() data: { userId: number; gameId: number },
    @ConnectedSocket() client: Socket
  ) {
    try {
      await this.gameService.leaveGame(data.userId, data.gameId)
      const game = await this.gameService.findGame(data.gameId)

      await client.leave(`game-${data.gameId}`)
      this.server.to(`game-${data.gameId}`).emit('gameUpdated', game)
    } catch (error) {
      client.emit('exception', { message: error.message })
    }
  }
}
