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
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn() id: number

  @Expose({ groups: ['me'] })
  @Column({ unique: true, nullable: false, length: 50 })
  username: string

  // TODO: rename to lastActiveAt
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamp', nullable: false })
  lastActiveAt: Date

  @OneToMany(() => Game, (game) => game.host)
  games: Relation<Game>[]

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.user)
  gamePlayers: Relation<GamePlayer>[]

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: Relation<RefreshToken>[]

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
