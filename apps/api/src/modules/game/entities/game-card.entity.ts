import { Exclude } from 'class-transformer'
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
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Entity()
@Index(['gameId', 'cardId'])
export class GameCard {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Game, (game) => game.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>

  @Exclude()
  @Column()
  gameId: number

  @ManyToOne(() => Card, (card) => card.gameCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Relation<Card>

  @Exclude()
  @Column()
  cardId: number

  @Column()
  row: number

  @Column()
  col: number

  @Column({ default: false })
  isMatched: boolean

  // @ts-ignore
  @ManyToOne(() => GamePlayer, (gamePlayer) => gamePlayer.matchedCards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'matchedById' })
  matchedBy: Relation<GamePlayer>

  @Exclude()
  @Column({ nullable: true })
  matchedById: number

  @Column({ default: false })
  isFlipped: boolean
}
