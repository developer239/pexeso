import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Entity()
export class GamePlayer {
  @PrimaryColumn()
  gameId: number

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => Game, (game) => game.players)
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>

  @ManyToOne(() => User, (user) => user.gamePlayers)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>

  @Column({ type: 'timestamp', nullable: true })
  turnStartedAt: Date | null

  @Column({ default: 0 })
  turnCount: number
}
