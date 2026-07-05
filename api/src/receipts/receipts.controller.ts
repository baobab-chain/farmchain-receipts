import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { IssueReceiptDto } from './dto/receipts.dto';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  issue(@Body() dto: IssueReceiptDto) {
    return this.receiptsService.issueReceipt(
      dto.farmerAddress,
      dto.cropType,
      dto.quantityKg,
      dto.grade,
      dto.storageLocation,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.receiptsService.getReceipt(id);
  }
}
