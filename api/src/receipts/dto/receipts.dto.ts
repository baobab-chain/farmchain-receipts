import { IsInt, IsPositive, IsString } from 'class-validator';

export class IssueReceiptDto {
  @IsString()
  farmerAddress: string;

  @IsString()
  cropType: string;

  @IsInt()
  @IsPositive()
  quantityKg: number;

  @IsString()
  grade: string;

  @IsString()
  storageLocation: string;
}
