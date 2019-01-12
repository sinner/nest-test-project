import {MigrationInterface, QueryRunner} from "typeorm";

export class User1547298781121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "last_login_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_login_at"`);
    }

}
