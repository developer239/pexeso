import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { gameConfig, GameConfigType } from 'src/config/game.config'
import { User } from 'src/modules/auth/entities/user.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Injectable()
export class GameService {
  constructor(
    // TODO: create separate service for each repository
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GamePlayer)
    private readonly gamePlayerRepository: Repository<GamePlayer>,
    @Inject(gameConfig.KEY)
    private readonly gameConfigValues: GameConfigType
  ) {}

  async findGame(id: number) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['host', 'players.user'],
    })

    return game
  }

  async createGame(hostId: number): Promise<Game> {
    const host = await this.userRepository.findOne({ where: { id: hostId } })
    if (!host) {
      throw new Error('User not found')
    }

    const game = new Game()
    game.host = host
    game.gridSize = {
      width: this.gameConfigValues.gridSizeW,
      height: this.gameConfigValues.gridSizeH,
    }
    game.maxPlayers = this.gameConfigValues.maxPlayers
    game.timeLimitSeconds = this.gameConfigValues.gameTimeLimitS
    game.turnLimitSeconds = this.gameConfigValues.turnTimeLimitS
    game.cardVisibleTimeSeconds = this.gameConfigValues.cardVisibleTimeS
    await this.gameRepository.save(game)

    const gamePlayer = new GamePlayer()
    gamePlayer.game = game
    gamePlayer.user = host
    await this.gamePlayerRepository.save(gamePlayer)

    return (await this.findGame(game.id))!
  }

  getAllGames(): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.players', 'players')
      .leftJoinAndSelect('players.user', 'user')
      .leftJoinAndSelect('game.host', 'host')
      .where('game.finishedAt IS NULL')
      .getMany()
  }

  async joinGame(userId: number, gameId: number): Promise<Game> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const game = await this.findGame(gameId)

    if (!user || !game) {
      throw new Error('User or Game not found')
    }

    const isPlayerInGame = game.players.find(
      (player) => player.user.id === userId
    )
    if (isPlayerInGame) {
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

    await this.gamePlayerRepository.save({ game, user })

    return (await this.findGame(game.id))!
  }

  async leaveGame(userId: number, gameId: number) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['players', 'players.user'],
    })

    if (!game) {
      throw new Error('Game not found')
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    const gamePlayer = game.players.find((player) => player.user.id === userId)
    if (!gamePlayer) {
      throw new Error('User is not in this game')
    }

    await this.gamePlayerRepository.delete({
      gameId: gamePlayer.gameId,
      userId: gamePlayer.userId,
    })

    game.players = game.players.filter((player) => player.user.id !== userId)

    if (game.players.length === 0) {
      await this.gameRepository.delete({ id: gameId })
    } else {
      const newHost = game.players[0].user

      await this.gameRepository.update({ id: gameId }, { host: newHost })
    }
  }

  async startGame(userId: number, gameId: number): Promise<Game> {
    const game = await this.findGame(gameId)

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

    game.startedAt = new Date()
    await this.gameRepository.update(
      { id: gameId },
      { startedAt: game.startedAt }
    )

    return game
  }

  getCurrentPlayerOnTurn = async (gameId: number): Promise<User> => {
    const game = await this.findGame(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    const currentPlayer = game.players.find((player) => player.isOnTurn)

    if (!currentPlayer) {
      throw new Error('No player on turn')
    }

    return currentPlayer.user
  }

  async endGame(game: Game) {
    if (!game.startedAt) {
      throw new Error('Game is not started')
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    game.finishedAt = new Date()

    await this.gameRepository.update(
      { id: game.id },
      { finishedAt: game.finishedAt }
    )
  }

  async passTurnToNextPlayer(gameId: number): Promise<User | undefined> {
    const game = await this.findGame(gameId)

    if (!game) {
      throw new Error('Game not found')
    }

    if (!game.startedAt) {
      return
    }

    if (game.finishedAt) {
      throw new Error('Game is finished')
    }

    const currentPlayerIndex = game.players.findIndex(
      (player) => player.isOnTurn
    )

    let nextPlayerIndex = -1
    if (game.players.length > 1) {
      if (currentPlayerIndex === -1) {
        nextPlayerIndex = 0
      } else {
        nextPlayerIndex =
          currentPlayerIndex + 1 === game.players.length
            ? 0
            : currentPlayerIndex + 1
      }
    } else {
      nextPlayerIndex = 0
    }

    await this.gamePlayerRepository.update(
      {
        gameId: game.id,
        // eslint-disable-next-line security/detect-object-injection
        userId: game.players[nextPlayerIndex].user.id,
      },
      {
        isOnTurn: true,
        // eslint-disable-next-line security/detect-object-injection
        turnCount: game.players[nextPlayerIndex].turnCount + 1,
      }
    )

    if (currentPlayerIndex !== -1 && game.players.length > 1) {
      await this.gamePlayerRepository.update(
        {
          gameId: game.id,
          // eslint-disable-next-line security/detect-object-injection
          userId: game.players[currentPlayerIndex].user.id,
        },
        {
          isOnTurn: false,
          // eslint-disable-next-line security/detect-object-injection
          turnCount: game.players[currentPlayerIndex].turnCount + 1,
        }
      )
    }

    // eslint-disable-next-line security/detect-object-injection
    return game.players[nextPlayerIndex].user
  }
}
