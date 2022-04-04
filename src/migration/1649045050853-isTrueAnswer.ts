import {MigrationInterface, QueryRunner} from "typeorm";

export class isTrueAnswer1649045050853 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "isTrue" boolean`)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "isTrue" boolean`)
    }

}
