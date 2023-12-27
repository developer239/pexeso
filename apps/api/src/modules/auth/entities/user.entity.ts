import * as bcrypt from 'bcrypt'
import { Exclude, Expose } from 'class-transformer'
import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm'
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity'
import { UserRole } from 'src/modules/auth/roles/roles.types'
import { EntityHelper } from 'src/utils/entity-helper'

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn() id: number

  @Expose({ groups: ['me', 'admin'] })
  @Column({ unique: true, nullable: true })
  email: string

  @Column() firstName: string

  @Column() lastName: string

  @Exclude({ toPlainOnly: true }) @Column({ nullable: true }) password: string

  @Exclude({ toPlainOnly: true }) public previousPassword: string

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt)
    }
  }

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
}
