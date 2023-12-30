import {
  Entity,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { Card } from 'src/modules/game/entities/card.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Entity()
@Index(['gameId', 'cardId'])
export class GameCard {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Game, (game) => game.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>

  @Column()
  gameId: number

  @ManyToOne(() => Card, (card) => card.gameCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Relation<Card>

  @Column()
  cardId: number

  @Column()
  row: number

  @Column()
  col: number

  @Column()
  isMatched: boolean

  @ManyToOne(() => User, (user) => user.matchedCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchedById' })
  matchedBy: Relation<User>

  @Column({ nullable: true })
  matchedById: number

  @Column()
  isFlipped: boolean
}
