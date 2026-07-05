import { Injectable } from '@nestjs/common';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { SorobanClientService } from '../common/soroban-client.service';

@Injectable()
export class ReceiptsService {
  constructor(private readonly soroban: SorobanClientService) {}

  async issueReceipt(
    farmerAddress: string,
    cropType: string,
    quantityKg: number,
    grade: string,
    storageLocation: string,
  ) {
    return this.soroban.invoke('issue_receipt', [
      nativeToScVal(this.soroban.servicePublicKey, { type: 'address' }), // warehouse_operator
      nativeToScVal(farmerAddress, { type: 'address' }),
      nativeToScVal(cropType, { type: 'symbol' }),
      nativeToScVal(quantityKg, { type: 'i128' }),
      nativeToScVal(grade, { type: 'symbol' }),
      nativeToScVal(storageLocation, { type: 'symbol' }),
    ]);
  }

  async getReceipt(receiptId: number) {
    return this.soroban.invoke('get_receipt', [nativeToScVal(receiptId, { type: 'u32' })]);
  }
}
