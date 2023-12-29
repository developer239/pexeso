import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { gameConfig, GameConfigType } from 'src/config/game.config'
import { User } from 'src/modules/auth/entities/user.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'

// TODO: remove HTTP errors 🤡
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
        },
        HttpStatus.NOT_FOUND
      )
    }

    const game = new Game()
    game.host = host
    game.gridSize = {
      width: this.gameConfigValues.gridSizeW,
      height: this.gameConfigValues.gridSizeH,
    }
    game.maxPlayers = this.gameConfigValues.maxPlayers
    game.timeLimitSeconds = this.gameConfigValues.gameTimeLimitS
    game.cardVisibleTimeSeconds = this.gameConfigValues.cardVisibleTimeS
    await this.gameRepository.save(game)

    const gamePlayer = new GamePlayer()
    gamePlayer.game = game
    gamePlayer.user = host
    await this.gamePlayerRepository.save(gamePlayer)

    return (await this.findGame(game.id))!
  }

  getAllGames(): Promise<Game[]> {
    return (
      this.gameRepository
        .createQueryBuilder('game')
        .leftJoinAndSelect('game.players', 'players')
        .leftJoinAndSelect('players.user', 'user')
        .leftJoinAndSelect('game.host', 'host')
        .where('game.startedAt IS NULL')
        // .andWhere("game.maxPlayers > (SELECT COUNT(*) FROM game_player WHERE game_player.\"gameId\" = game.id)")
        .getMany()
    )
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

    if (game.players.length === game.maxPlayers) {
      throw new Error('Game is full')
    }

    await this.gamePlayerRepository.save({ game, user })

    return (await this.findGame(game.id))!
  }

  async leaveGame(userId: number, gameId: number) {
    const gamePlayer = await this.gamePlayerRepository.findOne({
      where: {
        user: { id: userId },
        game: { id: gameId },
      },
    })

    if (!gamePlayer) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'User is not in this game',
        },
        HttpStatus.BAD_REQUEST
      )
    }

    await this.gamePlayerRepository.remove(gamePlayer)

    const currentGamePlayerCount = await this.gamePlayerRepository.count({
      where: { game: { id: gameId } },
    })

    if (currentGamePlayerCount === 0) {
      await this.gameRepository.delete({ id: gameId })
    }
  }
}
