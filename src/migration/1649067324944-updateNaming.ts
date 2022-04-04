import { MigrationInterface, QueryRunner } from 'typeorm'

export class updateNaming1649067324944 implements MigrationInterface {
  name = 'updateNaming1649067324944'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_closure" ("ancestor_id" uuid NOT NULL, "descendant_id" uuid NOT NULL, CONSTRAINT "PK_62498a67b134e0d62e79d40e5be" PRIMARY KEY ("ancestor_id", "descendant_id"))`,
    )
    await queryRunner.query(`CREATE INDEX "IDX_bf18b1d3430bd1ad93c424b395" ON "user_closure" ("ancestor_id") `)
    await queryRunner.query(`CREATE INDEX "IDX_889d52684c6688a80bb236459d" ON "user_closure" ("descendant_id") `)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActivity"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "lastActivity" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`)
    await queryRunner.query(
      `ALTER TABLE "user_closure" ADD CONSTRAINT "FK_bf18b1d3430bd1ad93c424b3957" FOREIGN KEY ("ancestor_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "user_closure" ADD CONSTRAINT "FK_889d52684c6688a80bb236459d8" FOREIGN KEY ("descendant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`DROP TABLE "user_closure_closure"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_closure" DROP CONSTRAINT "FK_889d52684c6688a80bb236459d8"`)
    await queryRunner.query(`ALTER TABLE "user_closure" DROP CONSTRAINT "FK_bf18b1d3430bd1ad93c424b3957"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActivity"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "lastActivity" jsonb NOT NULL DEFAULT '"2022-04-02T16:22:54.088Z"'`)
    await queryRunner.query(`DROP INDEX "public"."IDX_889d52684c6688a80bb236459d"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_bf18b1d3430bd1ad93c424b395"`)
    await queryRunner.query(`DROP TABLE "user_closure"`)
  }
}
