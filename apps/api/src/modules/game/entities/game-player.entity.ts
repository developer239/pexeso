import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
  OneToMany,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { GameCard } from 'src/modules/game/entities/game-card.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Entity()
export class GamePlayer {
  @PrimaryColumn()
  gameId: number

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => Game, (game) => game.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>

  @ManyToOne(() => User, (user) => user.gamePlayers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>

  @Column({ type: 'timestamp', nullable: true })
  turnStartedAt: Date | null

  @Column({ default: 0 })
  turnCount: number

  @OneToMany(() => GameCard, (gameCard) => gameCard.matchedBy)
  matchedCards: GameCard[]

  get score(): number {
    const matchedPairsCount = this.matchedCards.filter(
      (card) => card.isMatched
    ).length
    return matchedPairsCount / 2
  }
}
