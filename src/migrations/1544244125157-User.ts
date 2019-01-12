import {MigrationInterface, QueryRunner} from "typeorm";

export class User1544244125157 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" character varying(50) NOT NULL,
        "email" character varying(180) NOT NULL, "email_canonicalized" character varying(180) NOT NULL,
        "username" character varying(50) NOT NULL, "username_canonicalized" character varying(50) NOT NULL,
        "password" character varying(150) NOT NULL, "salt" character varying(150) NOT NULL, "first_name" character varying(150),
        "last_name" character varying(150), "display_name" character varying(300), "activation_code" character varying(150) NOT NULL,
        "roles" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "is_email_confirmed" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_by_id" integer,
        "updated_by_id" integer, CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "UQ_2b64f0aaeb3f38836c85cf0ff2c" UNIQUE ("email_canonicalized"),
        CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
        CONSTRAINT "UQ_e6a05bb8795962372fb8c04c90f" UNIQUE ("username_canonicalized"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"
         FOREIGN KEY ("created_by_id") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"
         FOREIGN KEY ("updated_by_id") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b489bba7c2e3d5afcd98a445ff8"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
