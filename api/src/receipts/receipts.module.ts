import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { SorobanClientService } from '../common/soroban-client.service';

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService, SorobanClientService],
  exports: [SorobanClientService],
})
export class ReceiptsModule {}
