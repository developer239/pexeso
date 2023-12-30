import { Injectable } from '@nestjs/common'
import { User } from 'src/modules/auth/entities/user.entity'
import { UsersRepository } from 'src/modules/auth/entities/users.repository'
import { Game } from 'src/modules/game/entities/game.entity'
import { GameRepository } from 'src/modules/game/entities/game.repository'

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly userRepository: UsersRepository
  ) {}

  async findGameById(gameId: number) {
    const game = await this.gameRepository.findById(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    return game
  }

  async createGame(hostId: number): Promise<Game> {
    const host = await this.userRepository.findById(hostId)
    if (!host) {
      throw new Error('User not found')
    }

    return this.gameRepository.createGameForHost(host)
  }

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.findAll()
  }

  async joinGame(userId: number, gameId: number): Promise<Game> {
    const user = await this.userRepository.findById(userId)
    const game = await this.gameRepository.findById(gameId)

    if (!user || !game) {
      throw new Error('User or Game not found')
    }

    if (game.isPlayerInGame(userId)) {
      return game
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    if (game.startedAt) {
      throw new Error('Game is started')
    }

    if (game.players.length === game.maxPlayers) {
      throw new Error('Game is full')
    }

    return this.gameRepository.addPlayer(game.id, user.id)
  }

  async leaveGame(userId: number, gameId: number) {
    const game = await this.gameRepository.findById(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    if (!game.isPlayerInGame(userId)) {
      throw new Error('User is not in this game')
    }

    const updatedGame = await this.gameRepository.removePlayer(game.id, userId)

    if (updatedGame.hasPlayers()) {
      return this.gameRepository.replaceHost(
        updatedGame.id,
        updatedGame.players[0].user
      )
    }

    await this.gameRepository.deleteById(updatedGame.id)
    return undefined
  }

  async startGame(userId: number, gameId: number): Promise<Game> {
    const game = await this.gameRepository.findById(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    if (game.startedAt) {
      throw new Error('Game is started')
    }

    if (game.host.id !== userId) {
      throw new Error('Only host can start the game')
    }

    return this.gameRepository.startGameById(game.id)
  }

  getCurrentPlayerOnTurn = async (
    gameId: number
  ): Promise<User | undefined> => {
    const game = await this.gameRepository.findById(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    return game.getPlayerOnTurn()?.user
  }

  async finishGame(gameId: number) {
    const game = await this.gameRepository.findById(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    if (!game.startedAt) {
      throw new Error('Game is not started')
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    return this.gameRepository.finishById(game.id)
  }

  async passTurnToNextPlayer(gameId: number): Promise<User | undefined> {
    const game = await this.gameRepository.findById(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    if (game.players.length === 0) {
      throw new Error('Game has no players')
    }

    if (!game.startedAt) {
      throw new Error('Game is not started')
    }

    const currentPlayer = game.getPlayerOnTurn()

    if (!currentPlayer) {
      const targetPlayer = game.players[0].user
      await this.gameRepository.passTurnToPlayer(game.id, targetPlayer.id)

      return targetPlayer
    }

    if (game.hasSinglePlayer()) {
      await this.gameRepository.passTurnToPlayer(game.id, currentPlayer.user.id)
      return currentPlayer.user
    }

    const newPlayerOnTurn = game.getPlayerToPassTurn()
    await this.gameRepository.passTurnToPlayer(game.id, newPlayerOnTurn.user.id)

    return newPlayerOnTurn.user
  }
}
