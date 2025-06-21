import { MigrationInterface, QueryRunner } from "typeorm";

export class Testesdsd1750012651672 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS task;`);
  }
}
