import { SorobanClientService } from '../common/soroban-client.service';
export declare class ReceiptsService {
    private readonly soroban;
    constructor(soroban: SorobanClientService);
    issueReceipt(farmerAddress: string, cropType: string, quantityKg: number, grade: string, storageLocation: string): Promise<any>;
    getReceipt(receiptId: number): Promise<any>;
}
