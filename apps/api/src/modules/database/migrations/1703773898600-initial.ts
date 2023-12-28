import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1703773898600 implements MigrationInterface {
  name = 'Initial1703773898600'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "gridSize" character varying NOT NULL, "maxPlayers" integer NOT NULL, "timeLimitSeconds" integer NOT NULL, "cardVisibleTimeSeconds" integer NOT NULL, "startedAt" TIMESTAMP, "finishedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hostId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game_player" ("gameId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_d230ed89795a91948c09cc6eef5" PRIMARY KEY ("gameId", "userId"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "lastActiveAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_4084468356497d7dcedd09502ff" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" ADD CONSTRAINT "FK_b9cc37cd3e74a0b8ee29a4990c8" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" ADD CONSTRAINT "FK_cf29fd39de7fd565d58673e690f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_player" DROP CONSTRAINT "FK_cf29fd39de7fd565d58673e690f"`
    )
    await queryRunner.query(
      `ALTER TABLE "game_player" DROP CONSTRAINT "FK_b9cc37cd3e74a0b8ee29a4990c8"`
    )
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_4084468356497d7dcedd09502ff"`
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "game_player"`)
    await queryRunner.query(`DROP TABLE "game"`)
  }
}
