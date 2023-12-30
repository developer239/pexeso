import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1703903332952 implements MigrationInterface {
  name = 'Initial1703903332952'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game_player" ("gameId" integer NOT NULL, "userId" integer NOT NULL, "isOnTurn" boolean NOT NULL DEFAULT false, "turnCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d230ed89795a91948c09cc6eef5" PRIMARY KEY ("gameId", "userId"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "gridSize" character varying NOT NULL, "maxPlayers" integer NOT NULL, "timeLimitSeconds" integer NOT NULL, "turnLimitSeconds" integer NOT NULL, "cardVisibleTimeSeconds" integer NOT NULL, "startedAt" TIMESTAMP, "finishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hostId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game_card" ("gameId" integer NOT NULL, "cardId" integer NOT NULL, "row" integer NOT NULL, "col" integer NOT NULL, "isMatched" boolean NOT NULL, "isFlipped" boolean NOT NULL, "userId" integer, "matchedById" integer, CONSTRAINT "PK_a42d71fe889f0912df94922fda5" PRIMARY KEY ("gameId", "cardId"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "lastActiveAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" ADD CONSTRAINT "FK_b9cc37cd3e74a0b8ee29a4990c8" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" ADD CONSTRAINT "FK_cf29fd39de7fd565d58673e690f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_4084468356497d7dcedd09502ff" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" ADD CONSTRAINT "FK_bb7ef7d33230c675cc5d5071a89" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" ADD CONSTRAINT "FK_e80ea65a3860097c479df277bc8" FOREIGN KEY ("userId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" ADD CONSTRAINT "FK_a6d8fce165c17c531e050bb0b8a" FOREIGN KEY ("matchedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_card" DROP CONSTRAINT "FK_a6d8fce165c17c531e050bb0b8a"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" DROP CONSTRAINT "FK_e80ea65a3860097c479df277bc8"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_card" DROP CONSTRAINT "FK_bb7ef7d33230c675cc5d5071a89"`
    )
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_4084468356497d7dcedd09502ff"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" DROP CONSTRAINT "FK_cf29fd39de7fd565d58673e690f"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" DROP CONSTRAINT "FK_b9cc37cd3e74a0b8ee29a4990c8"`
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "game_card"`)
    await queryRunner.query(`DROP TABLE "game"`)
    await queryRunner.query(`DROP TABLE "game_player"`)
    await queryRunner.query(`DROP TABLE "card"`)
  }
}
