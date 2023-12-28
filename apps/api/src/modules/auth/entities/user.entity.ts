import { Exclude, Expose } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  Relation,
} from 'typeorm'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn() id: number

  @Column({ unique: true, nullable: false, length: 50 })
  username: string

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamp', nullable: false })
  lastActiveAt: Date

  @OneToMany(() => Game, (game) => game.host)
  games: Relation<Game>[]

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.user)
  gamePlayers: Relation<GamePlayer>[]

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date

  @BeforeInsert()
  updateLastActive() {
    if (!this.lastActiveAt) {
      this.lastActiveAt = new Date()
    }
  }
}
