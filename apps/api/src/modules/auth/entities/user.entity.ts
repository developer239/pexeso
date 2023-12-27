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
} from 'typeorm'
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn() id: number

  @Expose({ groups: ['me'] })
  @Column({ unique: true, nullable: false, length: 50 })
  username: string

  @Expose({ groups: ['me'] })
  @Column({ type: 'timestamptz', nullable: false })
  lastActive: Date

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[]

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date

  @BeforeInsert()
  updateLastActive() {
    if (!this.lastActive) {
      this.lastActive = new Date()
    }
  }
}
