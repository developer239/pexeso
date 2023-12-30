import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Card } from 'src/modules/game/entities/card.entity'
import { GameCard } from 'src/modules/game/entities/game-card.entity'

@Injectable()
export class CardRepository {
  constructor(
    @InjectRepository(Card) private readonly gameRepository: Repository<Card>,
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
}
