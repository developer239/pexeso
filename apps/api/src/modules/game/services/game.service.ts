import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
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
      relations: ['host', 'players'],
    })

    if (!game) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Game not found',
        },
        HttpStatus.NOT_FOUND
      )
    }

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

    return game
  }

  getAllGames(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['host', 'players'],
      where: {
        startedAt: IsNull(),
      },
    })
  }

  async joinGame(userId: number, gameId: number): Promise<Game> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['players'],
    })

    if (!user || !game) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'User or Game not found',
        },
        HttpStatus.NOT_FOUND
      )
    }

    if (game.players.length > game.maxPlayers) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Game is full',
        },
        HttpStatus.BAD_REQUEST
      )
    }

    await this.gamePlayerRepository.save({ game, user })

    const updatedGame = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['host', 'players'],
    })

    return updatedGame!
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
  }
}
