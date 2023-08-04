import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsModule } from '../auction/auctions.module';
import { CommentsModule } from '../comment/comments.module';
import { DelegationModule } from '../delegation/delegation.module';
import { ApplicationModule } from '../delegation-application/application.module';
import { DelegateModule } from '../delegate/delegate.module';
import { CommunitiesModule } from '../community/community.module';
import { AdminModule } from '../admin/admin.module';

import configuration from '../config/configuration';
import { ProposalsModule } from '../proposal/proposals.module';
import { TasksModule } from '../task/tasks.module';
import { VotesModule } from '../vote/votes.module';
import config from '../../ormconfig';
import { SnapshotModule } from '../voting-power-snapshot/snapshot.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
// import { AudioModule } from '../queue/audio.module';

/**
 * Import and provide base typeorm (mysql) related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    VotesModule,
    AuctionsModule,
    ProposalsModule,
    CommunitiesModule,
    TasksModule,
    DelegationModule,
    ApplicationModule,
    DelegateModule,
    CommentsModule,
    AdminModule,
    SnapshotModule,
    // AudioModule,
    BlockchainModule,
    TypeOrmModule.forRoot(config),
  ],
})
export class PostgresDatabaseProviderModule {}
