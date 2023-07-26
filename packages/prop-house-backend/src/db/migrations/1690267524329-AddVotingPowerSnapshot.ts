import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVotingPowerSnapshot1690267524329 implements MigrationInterface {

    name = 'AddVotingPowerSnapshot1690267524329';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "snapshot" ( 
                "id" SERIAL NOT NULL, 
                "blockNum" integer NOT NULL, 
                "address" character varying NOT NULL, 
                "votingPower" integer NOT NULL, 
                "createdDate" TIMESTAMP NOT NULL, 
                CONSTRAINT "PK_zd9872szfouA7sy0saf7w7er0" PRIMARY KEY ("id"))`,
          );        
    }
    // public async up(queryRunner: QueryRunner): Promise<void> {
    //     await queryRunner.query(
    //         `CREATE TABLE "snapshot" ( 
    //             "id" SERIAL NOT NULL, 
    //             "delegationId" integer NOT NULL, 
    //             "applicationId" integer NOT NULL, 
    //             "delegateId" integer NOT NULL, 
    //             "fromAddress" character varying NOT NULL, 
    //             "toAddress" character varying NOT NULL, 
    //             "votingPower" integer NOT NULL, 
    //             "createdDate" TIMESTAMP NOT NULL, 
    //             "lastUpdatedDate" TIMESTAMP, 
    //             CONSTRAINT "PK_zd9872szfouA7sy0saf7w7er9" PRIMARY KEY ("id"))`,
    //       );        
    // }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "snapshot"`);
    }
}
