import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@Entity()
export class RefreshToken extends EntityHelper {
  @PrimaryGeneratedColumn() id: number

  @ManyToOne(() => User, (user) => user.refreshTokens, { eager: true })
  user: User

  @Index() @Column() value: string

  @Column({
    nullable: true,
  })
  ipAddress: string

  @CreateDateColumn({ type: 'timestamp' }) createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' }) updatedAt: Date
}
