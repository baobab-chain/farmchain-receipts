import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LoansService } from './loans.service';
import { RequestLoanDto, FundLoanDto, RepayLoanDto, ClaimDefaultDto } from './dto/loans.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  request(@Body() dto: RequestLoanDto) {
    return this.loansService.requestLoan(
      dto.farmerAddress,
      dto.receiptId,
      dto.tokenContractId,
      dto.amount,
      dto.dueLedger,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.getLoan(id);
  }

  @Post(':id/fund')
  fund(@Param('id', ParseIntPipe) id: number, @Body() dto: FundLoanDto) {
    return this.loansService.fundLoan(id, dto.lenderAddress);
  }

  @Post(':id/repay')
  repay(@Param('id', ParseIntPipe) id: number, @Body() dto: RepayLoanDto) {
    return this.loansService.repayLoan(id, dto.farmerAddress);
  }

  @Post(':id/claim-default')
  claimDefault(@Param('id', ParseIntPipe) id: number, @Body() dto: ClaimDefaultDto) {
    return this.loansService.claimDefault(id, dto.lenderAddress);
  }
}
