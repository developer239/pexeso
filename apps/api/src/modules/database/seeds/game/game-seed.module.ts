import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameSeedService } from 'src/modules/database/seeds/game/game-seed.service'
import { Card } from 'src/modules/game/entities/card.entity'
import { GameCard } from 'src/modules/game/entities/game-card.entity'
import { GamePlayer } from 'src/modules/game/entities/game-player.entity'
import { Game } from 'src/modules/game/entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Game, GamePlayer, Card, GameCard])],
  providers: [GameSeedService],
  exports: [GameSeedService],
})
export class GameSeedModule {}
