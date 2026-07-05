import { Injectable } from '@nestjs/common';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { SorobanClientService } from '../common/soroban-client.service';

@Injectable()
export class LoansService {
  constructor(private readonly soroban: SorobanClientService) {}

  async requestLoan(
    farmerAddress: string,
    receiptId: number,
    tokenContractId: string,
    amount: number,
    dueLedger: number,
  ) {
    return this.soroban.invoke('request_loan', [
      nativeToScVal(farmerAddress, { type: 'address' }),
      nativeToScVal(receiptId, { type: 'u32' }),
      nativeToScVal(tokenContractId, { type: 'address' }),
      nativeToScVal(amount, { type: 'i128' }),
      nativeToScVal(dueLedger, { type: 'u32' }),
    ]);
  }

  async fundLoan(loanId: number, lenderAddress: string) {
    return this.soroban.invoke('fund_loan', [
      nativeToScVal(lenderAddress, { type: 'address' }),
      nativeToScVal(loanId, { type: 'u32' }),
    ]);
  }

  async repayLoan(loanId: number, farmerAddress: string) {
    return this.soroban.invoke('repay_loan', [
      nativeToScVal(farmerAddress, { type: 'address' }),
      nativeToScVal(loanId, { type: 'u32' }),
    ]);
  }

  async claimDefault(loanId: number, lenderAddress: string) {
    return this.soroban.invoke('claim_default', [
      nativeToScVal(lenderAddress, { type: 'address' }),
      nativeToScVal(loanId, { type: 'u32' }),
    ]);
  }

  async getLoan(loanId: number) {
    return this.soroban.invoke('get_loan', [nativeToScVal(loanId, { type: 'u32' })]);
  }
}
