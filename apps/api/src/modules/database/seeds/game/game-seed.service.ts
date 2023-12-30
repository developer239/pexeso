import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'
import { Card } from 'src/modules/game/entities/card.entity'

@Injectable()
export class GameSeedService implements ISeedService {
  constructor(
    @InjectRepository(Card)
    private readonly repository: Repository<Card>
  ) {}

  public async run() {
    await this.createCards()
  }

  private async createCards() {
    await this.repository.save(
      this.repository.create([
        {
          image: 'card-1.jpg',
        },
        {
          image: 'card-2.jpg',
        },
        {
          image: 'card-3.jpg',
        },
        {
          image: 'card-4.jpg',
        },
        {
          image: 'card-5.jpg',
        },
        {
          image: 'card-6.jpg',
        },
        {
          image: 'card-7.jpg',
        },
        {
          image: 'card-8.jpg',
        },
        {
          image: 'card-9.jpg',
        },
        {
          image: 'card-10.jpg',
        },
        {
          image: 'card-11.jpg',
        },
        {
          image: 'card-12.jpg',
        },
        {
          image: 'card-13.jpg',
        },
        {
          image: 'card-14.jpg',
        },
        {
          image: 'card-15.jpg',
        },
        {
          image: 'card-16.jpg',
        },
        {
          image: 'card-17.jpg',
        },
        {
          image: 'card-18.jpg',
        },
        {
          image: 'card-19.jpg',
        },
        {
          image: 'card-20.jpg',
        },
        {
          image: 'card-21.jpg',
        },
        {
          image: 'card-22.jpg',
        },
        {
          image: 'card-23.jpg',
        },
        {
          image: 'card-24.jpg',
        },
      ])
    )
  }
}
