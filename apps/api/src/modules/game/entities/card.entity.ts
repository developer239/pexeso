import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { GameCard } from 'src/modules/game/entities/game-card.entity'

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  image: string

  @OneToMany(() => GameCard, (gameCard) => gameCard.card)
  gameCards: Relation<GameCard>[]
}
