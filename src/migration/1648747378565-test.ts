import {MigrationInterface, QueryRunner} from "typeorm";

export class test1648747378565 implements MigrationInterface {
    name = 'test1648747378565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_5fd605f755be75e9ea3ee3fdc18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'BASIC', "lastActivity" jsonb NOT NULL, "parentId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_question_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid, "questionId" uuid, "answerId" uuid, CONSTRAINT "PK_2a1f6d55e05397b0aa0acd5ce33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "description" character varying NOT NULL, "questionCategoryId" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "description" character varying NOT NULL, "questionId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_closure_closure" ("ancestor_id" uuid NOT NULL, "descendant_id" uuid NOT NULL, CONSTRAINT "PK_9f398ec8e30172b132aab8b6e78" PRIMARY KEY ("ancestor_id", "descendant_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c13c4a4827f46c300021178370" ON "user_closure_closure" ("ancestor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a99a1eee3bd7011bf20dc0364f" ON "user_closure_closure" ("descendant_id") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c86f56da7bb30c073e3cbed4e50" FOREIGN KEY ("parentId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_question_answer" ADD CONSTRAINT "FK_6ed2f37eb45673aa6985350ab4b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_question_answer" ADD CONSTRAINT "FK_5027f720975581d306833a41246" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_question_answer" ADD CONSTRAINT "FK_c51616d43d401b43178acca8b1b" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_d7c3c1e830d2c9f2876204b5836" FOREIGN KEY ("questionCategoryId") REFERENCES "question_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_closure_closure" ADD CONSTRAINT "FK_c13c4a4827f46c3000211783700" FOREIGN KEY ("ancestor_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_closure_closure" ADD CONSTRAINT "FK_a99a1eee3bd7011bf20dc0364f1" FOREIGN KEY ("descendant_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_closure_closure" DROP CONSTRAINT "FK_a99a1eee3bd7011bf20dc0364f1"`);
        await queryRunner.query(`ALTER TABLE "user_closure_closure" DROP CONSTRAINT "FK_c13c4a4827f46c3000211783700"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_d7c3c1e830d2c9f2876204b5836"`);
        await queryRunner.query(`ALTER TABLE "user_question_answer" DROP CONSTRAINT "FK_c51616d43d401b43178acca8b1b"`);
        await queryRunner.query(`ALTER TABLE "user_question_answer" DROP CONSTRAINT "FK_5027f720975581d306833a41246"`);
        await queryRunner.query(`ALTER TABLE "user_question_answer" DROP CONSTRAINT "FK_6ed2f37eb45673aa6985350ab4b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c86f56da7bb30c073e3cbed4e50"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a99a1eee3bd7011bf20dc0364f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c13c4a4827f46c300021178370"`);
        await queryRunner.query(`DROP TABLE "user_closure_closure"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "user_question_answer"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "question_category"`);
    }

}
