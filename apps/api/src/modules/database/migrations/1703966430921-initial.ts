import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1703966430921 implements MigrationInterface {
  name = 'Initial1703966430921'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "gridSize" character varying NOT NULL, "maxPlayers" integer NOT NULL, "timeLimitSeconds" integer NOT NULL, "turnLimitSeconds" integer NOT NULL, "cardVisibleTimeSeconds" integer NOT NULL, "startedAt" TIMESTAMP, "finishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hostId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "lastActiveAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game_player" ("gameId" integer NOT NULL, "userId" integer NOT NULL, "turnStartedAt" TIMESTAMP, "turnCount" integer NOT NULL DEFAULT '0', "cardsFlippedThisTurn" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d230ed89795a91948c09cc6eef5" PRIMARY KEY ("gameId", "userId"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game_card" ("id" SERIAL NOT NULL, "gameId" integer NOT NULL, "cardId" integer NOT NULL, "row" integer NOT NULL, "col" integer NOT NULL, "isMatched" boolean NOT NULL DEFAULT false, "matchedByUserId" integer, "matchedByGameId" integer, "isFlipped" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b3a1cbc416f2533b795c147eee2" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a42d71fe889f0912df94922fda" ON "game_card" ("gameId", "cardId") `
    )
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_4084468356497d7dcedd09502ff" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" ADD CONSTRAINT "FK_b9cc37cd3e74a0b8ee29a4990c8" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" ADD CONSTRAINT "FK_cf29fd39de7fd565d58673e690f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" ADD CONSTRAINT "FK_bb7ef7d33230c675cc5d5071a89" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" ADD CONSTRAINT "FK_d6902242ce6d83a4f7f95eaa406" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" ADD CONSTRAINT "FK_6a0e31d3d7c68a8f31b90ab4c07" FOREIGN KEY ("matchedByUserId", "matchedByGameId") REFERENCES "game_player"("userId","gameId") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_card" DROP CONSTRAINT "FK_6a0e31d3d7c68a8f31b90ab4c07"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" DROP CONSTRAINT "FK_d6902242ce6d83a4f7f95eaa406"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" DROP CONSTRAINT "FK_bb7ef7d33230c675cc5d5071a89"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" DROP CONSTRAINT "FK_cf29fd39de7fd565d58673e690f"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" DROP CONSTRAINT "FK_b9cc37cd3e74a0b8ee29a4990c8"`
    )
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_4084468356497d7dcedd09502ff"`
    )
    await queryRunner.query(`DROP TABLE "card"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a42d71fe889f0912df94922fda"`
    )
    await queryRunner.query(`DROP TABLE "game_card"`)
    await queryRunner.query(`DROP TABLE "game_player"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "game"`)
  }
}
