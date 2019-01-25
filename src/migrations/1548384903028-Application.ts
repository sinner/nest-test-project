import {MigrationInterface, QueryRunner} from "typeorm";

export class Application1548384903028 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "application" ("id" SERIAL NOT NULL, "uuid" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(300), "platform" character varying(5), "main_picture" character varying(255), "api_key" character varying(60) NOT NULL, "api_key_secret" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "created_by_id" integer, "updated_by_id" integer, CONSTRAINT "UQ_71af2cd4dccba665296d4befbfe" UNIQUE ("uuid"), CONSTRAINT "UQ_608bb41e7e1ef5f6d7abb07e394" UNIQUE ("name"), CONSTRAINT "UQ_1ee0c57f3cb57d532117b4ba387" UNIQUE ("api_key"), CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e8db13743db4afd7dfc97620b5" ON "application"  ("api_key", "api_key_secret") `);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_5975356c511ee9549b0d684467b" FOREIGN KEY ("created_by_id") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_c31d0253d6011db560e8759d7c6" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_c31d0253d6011db560e8759d7c6"`);
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_5975356c511ee9549b0d684467b"`);
        await queryRunner.query(`DROP INDEX "IDX_e8db13743db4afd7dfc97620b5"`);
        await queryRunner.query(`DROP TABLE "application"`);
    }

}
