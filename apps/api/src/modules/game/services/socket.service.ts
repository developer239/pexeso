import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
  private server: Server

  public setServer(server: Server) {
    this.server = server
  }

  public emit(event: string, payload: any) {
    this.server.emit(event, payload)
  }
}
