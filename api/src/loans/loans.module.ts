import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { SorobanClientService } from '../common/soroban-client.service';

@Module({
  controllers: [LoansController],
  providers: [LoansService, SorobanClientService],
})
export class LoansModule {}
