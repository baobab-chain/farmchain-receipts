import { IsInt, IsPositive, IsString } from 'class-validator';

export class RequestLoanDto {
  @IsString()
  farmerAddress: string;

  @IsInt()
  receiptId: number;

  @IsString()
  tokenContractId: string;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsInt()
  @IsPositive()
  dueLedger: number;
}

export class FundLoanDto {
  @IsString()
  lenderAddress: string;
}

export class RepayLoanDto {
  @IsString()
  farmerAddress: string;
}

export class ClaimDefaultDto {
  @IsString()
  lenderAddress: string;
}
