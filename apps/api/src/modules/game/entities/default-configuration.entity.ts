import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { GridSizeTransformer } from 'src/modules/game/transformers/gridSize.transformer'

@Entity()
export class DefaultConfiguration {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    transformer: new GridSizeTransformer(),
  })
  gridSize: { width: number; height: number }

  @Column()
  timeLimitSeconds: number

  @Column()
  cardVisibleTimeSeconds: number
}
