import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Not, Repository } from 'typeorm'
import { gameConfig, GameConfigType } from 'src/config/game.config'
import { User } from 'src/modules/auth/entities/user.entity'
import { CardRepository } from 'src/modules/game/entities/card.repository'
import { GameCard } from 'src/modules/game/entities/game-card.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { shuffleArray } from 'src/utils/common'

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @Inject(gameConfig.KEY)
    private readonly gameConfigValues: GameConfigType,
    @InjectRepository(GamePlayer)
    private readonly gamePlayerRepository: Repository<GamePlayer>,
    private readonly cardRepository: CardRepository
  ) {}

  async prune() {
    const now = new Date()

    // prune games that are started but not finished and have exceeded time limit
    await this.gameRepository
      .createQueryBuilder()
      .delete()
      .where(
        `"finishedAt" IS NULL
        AND "startedAt" IS NOT NULL
        AND "startedAt" + "timeLimitSeconds" * INTERVAL '1 second' < :now`,
        { now }
      )
      .execute()

    // prune games that were created but not started in 20 minutes
    await this.gameRepository
      .createQueryBuilder()
      .delete()
      .where('"createdAt" < :timeLimit', {
        timeLimit: new Date(now.getTime() - 20 * 600 * 1000),
      })
      .andWhere('"startedAt" IS NULL')
      .execute()
  }

  async findById(id: number): Promise<Game | null> {
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.host', 'host')
      .leftJoinAndSelect('game.players', 'players')
      .leftJoinAndSelect('players.user', 'user')
      .leftJoinAndSelect('players.matchedCards', 'matchedCards')
      .leftJoin('game.cards', 'cards')
      // TODO: make classTransfomer work to hide cardId
      .addSelect([
        'cards.id',
        'cards.row',
        'cards.col',
        'cards.isMatched',
        'cards.isFlipped',
      ])
      .leftJoinAndSelect(
        'cards.card',
        'card',
        'cards.isMatched = true OR cards.isFlipped = true'
      )
      .where('game.id = :id', { id })
      .getOne()

    return game
  }

  findAll(): Promise<Game[]> {
    return this.gameRepository.find({
      where: { finishedAt: IsNull() },
      relations: ['host', 'players.user'],
    })
  }

  // TODO: use transaction
  async createGameForHost(host: User): Promise<Game> {
    // Create game
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

    if ((game.gridSize.width * game.gridSize.height) % 2 !== 0) {
      throw new Error('Number of cards not divisible by two')
    }

    const requestedNumberOfCards =
      (game.gridSize.width * game.gridSize.height) / 2
    const totalNumberOfCards = await this.cardRepository.countAvailableCards()

    if (requestedNumberOfCards > totalNumberOfCards) {
      throw new Error('Not enough cards')
    }

    await this.gameRepository.save(game)

    // Add host as player
    const gamePlayer = new GamePlayer()
    gamePlayer.game = game
    gamePlayer.user = host
    await this.gamePlayerRepository.save(gamePlayer)

    const cards = await this.cardRepository.getRandomCards(
      requestedNumberOfCards
    )
    const pairedCardsStack = [...cards, ...cards]
    shuffleArray(pairedCardsStack)

    const gameCardsToAdd: GameCard[] = []
    for (let row = 0; row < game.gridSize.height; row += 1) {
      for (let col = 0; col < game.gridSize.width; col += 1) {
        const gameCard = new GameCard()
        gameCard.card = pairedCardsStack.pop()!
        gameCard.game = game
        gameCard.row = row
        gameCard.col = col

        gameCardsToAdd.push(gameCard)
      }
    }
    await this.cardRepository.saveGameCards(gameCardsToAdd)

    return (await this.findById(game.id))!
  }

  async addPlayer(gameId: number, userId: number): Promise<Game> {
    await this.gamePlayerRepository.save({
      game: { id: gameId },
      user: { id: userId },
    })
    return (await this.findById(gameId))!
  }

  async removePlayer(gameId: number, userId: number): Promise<Game> {
    await this.gamePlayerRepository.delete({
      game: { id: gameId },
      user: { id: userId },
    })
    return (await this.findById(gameId))!
  }

  async replaceHost(gameId: number, user: User): Promise<Game> {
    await this.gameRepository.save({
      id: gameId,
      host: user,
    })

    return (await this.findById(gameId))!
  }

  async deleteById(gameId: number) {
    await this.gameRepository.delete(gameId)
  }

  async startGameById(gameId: number) {
    await this.gameRepository.update({ id: gameId }, { startedAt: new Date() })

    return (await this.findById(gameId))!
  }

  async finishById(gameId: number) {
    await this.gameRepository.update({ id: gameId }, { finishedAt: new Date() })

    return (await this.findById(gameId))!
  }

  async passTurnToPlayer(gameId: number, playerId: number) {
    await this.gamePlayerRepository.update(
      {
        gameId,
        userId: playerId,
      },
      {
        turnStartedAt: new Date(),
        turnCount: () => 'turnCount + 1',
      }
    )
    await this.gamePlayerRepository.update(
      {
        gameId,
        userId: Not(playerId),
      },
      {
        turnStartedAt: null,
      }
    )
  }
}
