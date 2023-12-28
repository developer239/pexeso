import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { GridSizeTransformer } from 'src/modules/game/transformers/gridSize.transformer'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.games)
  host: Relation<User>

  @Column({
    type: 'varchar',
    transformer: new GridSizeTransformer(),
  })
  gridSize: { width: number; height: number }

  @Column()
  maxPlayers: number

  @Column()
  timeLimitSeconds: number

  @Column()
  cardVisibleTimeSeconds: number

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date | null

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.game)
  players: Relation<GamePlayer>[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
