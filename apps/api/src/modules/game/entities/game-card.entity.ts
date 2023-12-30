import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { Card } from 'src/modules/game/entities/card.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Entity()
export class GameCard {
  @PrimaryColumn()
  gameId: number

  @PrimaryColumn()
  cardId: number

  @ManyToOne(() => Game, (game) => game.cards)
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>

  @ManyToOne(() => Card, (user) => user.gameCards)
  @JoinColumn({ name: 'userId' })
  card: Relation<Card>

  @Column()
  row: number

  @Column()
  col: number

  @Column()
  isMatched: boolean

  @ManyToOne(() => User, (user) => user.matchedCards)
  matchedBy: Relation<User>

  @Column()
  isFlipped: boolean
}
