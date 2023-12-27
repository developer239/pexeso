import { MigrationInterface, QueryRunner } from 'typeorm'

export class initial1685375829546 implements MigrationInterface {
  name = 'initial1685375829546'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "ipAddress" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7f2bc25df3afe0d69f71bd6170" ON "refresh_token" ("value") `
    )
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('1', '2')`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`
    )
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f2bc25df3afe0d69f71bd6170"`
    )
    await queryRunner.query(`DROP TABLE "refresh_token"`)
  }
}
