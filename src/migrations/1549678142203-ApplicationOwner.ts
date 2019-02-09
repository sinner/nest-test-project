import {MigrationInterface, QueryRunner} from "typeorm";

export class ApplicationOwner1549678142203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "application" ADD "owner_id" integer`);
        await queryRunner.query(`ALTER TABLE "application" ADD CONSTRAINT "FK_d8a9ec30fc672e96b6920e436a4" FOREIGN KEY ("owner_id") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "application" DROP CONSTRAINT "FK_d8a9ec30fc672e96b6920e436a4"`);
        await queryRunner.query(`ALTER TABLE "application" DROP COLUMN "owner_id"`);
    }

}
