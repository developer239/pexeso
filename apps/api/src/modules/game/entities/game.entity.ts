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
import { GameCard } from 'src/modules/game/entities/game-card.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { GridSizeTransformer } from 'src/modules/game/transformers/gridSize.transformer'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, (user) => user.games, {
    cascade: true,
  })
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
  turnLimitSeconds: number

  @Column()
  cardVisibleTimeSeconds: number

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date | null

  @OneToMany(() => GamePlayer, (gamePlayer) => gamePlayer.game)
  players: Relation<GamePlayer>[]

  @OneToMany(() => GameCard, (gameCard) => gameCard.game)
  cards: Relation<GameCard>[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  isPlayerInGame(userId: number) {
    return this.players.find((player) => player.user.id === userId)
  }

  hasPlayers() {
    return this.players.length > 0
  }

  hasSinglePlayer() {
    return this.players.length === 1
  }

  getPlayerOnTurn(): Relation<GamePlayer | undefined> {
    return this.players.find((player) => player.isOnTurn)
  }

  getPlayerToPassTurn() {
    const currentPlayerIndex = this.players.findIndex(
      (player) => player.isOnTurn
    )
    const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length

    // TODO: false positive?
    // eslint-disable-next-line security/detect-object-injection
    return this.players[nextPlayerIndex]
  }

  getMsTillGameEnds() {
    const gameEndsAt = new Date(
      this.startedAt!.getTime() + this.timeLimitSeconds * 1000
    )

    return gameEndsAt.getTime() - Date.now()
  }

  getMsTillTurnEnds() {
    const turnEndsAt = new Date(Date.now() + this.turnLimitSeconds * 1000)

    return turnEndsAt.getTime() - Date.now()
  }

  isFull() {
    return this.players.length === this.maxPlayers
  }
}
