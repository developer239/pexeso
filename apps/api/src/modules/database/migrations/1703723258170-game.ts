import { MigrationInterface, QueryRunner } from 'typeorm'

export class Game1703723258170 implements MigrationInterface {
  name = 'Game1703723258170'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "gridSize" character varying NOT NULL, "maxPlayers" integer NOT NULL, "timeLimitSeconds" integer NOT NULL, "cardVisibleTimeSeconds" integer NOT NULL, "startedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hostId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "game_player" ("gameId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_d230ed89795a91948c09cc6eef5" PRIMARY KEY ("gameId", "userId"))`
    )
    await queryRunner.query(
      `CREATE TABLE "default_configuration" ("id" SERIAL NOT NULL, "gridSize" character varying NOT NULL, "timeLimitSeconds" integer NOT NULL, "cardVisibleTimeSeconds" integer NOT NULL, CONSTRAINT "PK_0540c1b522654277145484898e5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActive"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastActiveAt" TIMESTAMP NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "createdAt"`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "updatedAt"`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
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
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "updatedAt"`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "createdAt"`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveAt"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastActive" TIMESTAMP WITH TIME ZONE NOT NULL`
    )
    await queryRunner.query(`DROP TABLE "default_configuration"`)
    await queryRunner.query(`DROP TABLE "game_player"`)
    await queryRunner.query(`DROP TABLE "game"`)
  }
}
