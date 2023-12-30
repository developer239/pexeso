import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Card } from 'src/modules/game/entities/card.entity'
import { GameCard } from 'src/modules/game/entities/game-card.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'

@Injectable()
export class CardRepository {
  constructor(
    @InjectRepository(Card) private readonly gameRepository: Repository<Card>,
    @InjectRepository(GamePlayer)
    private readonly gamePlayerRepository: Repository<GamePlayer>,
    @InjectRepository(GameCard)
    private readonly gameCardRepository: Repository<GameCard>
  ) {}

  countAvailableCards() {
    return this.gameRepository.count()
  }

  saveGameCards(gameCards: GameCard[]) {
    return this.gameCardRepository.save(gameCards)
  }

  getRandomCards(count: number) {
    return this.gameRepository
      .createQueryBuilder()
      .orderBy('RANDOM()')
      .limit(count)
      .getMany()
  }

  // TODO: use transaction
  async flipCard(gameCardId: number, playerOnTurn: GamePlayer) {
    await this.gameCardRepository.update(gameCardId, { isFlipped: true })
    await this.gamePlayerRepository.update(
      {
        gameId: playerOnTurn.gameId,
        userId: playerOnTurn.userId,
      },
      {
        cardsFlippedThisTurn: playerOnTurn.cardsFlippedThisTurn + 1,
      }
    )
  }

  async checkFlippedCards(
    gameId: number,
    matchedBy: GamePlayer
  ): Promise<boolean> {
    const cards = await this.gameCardRepository.find({
      where: {
        gameId,
        isFlipped: true,
        isMatched: false,
      },
    })

    // if cards are the same mark as matched
    if (cards.length === 2) {
      const firstCard = cards[0]
      const secondCard = cards[1]

      if (firstCard.cardId === secondCard.cardId) {
        await this.gameCardRepository.update(
          {
            id: firstCard.id,
            gameId,
            cardId: firstCard.cardId,
          },
          { isMatched: true, matchedBy }
        )

        await this.gameCardRepository.update(
          {
            id: secondCard.id,
            gameId,
            cardId: firstCard.cardId,
          },
          { isMatched: true, matchedBy }
        )

        return true
      }
    }

    return false
  }

  flipAllUnmatchedCardsByGameId(gameId: number) {
    return this.gameCardRepository.update(
      {
        gameId,
        isMatched: false,
      },
      {
        isFlipped: false,
      }
    )
  }
}
