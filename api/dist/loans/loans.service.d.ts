import { SorobanClientService } from '../common/soroban-client.service';
export declare class LoansService {
    private readonly soroban;
    constructor(soroban: SorobanClientService);
    requestLoan(farmerAddress: string, receiptId: number, tokenContractId: string, amount: number, dueLedger: number): Promise<any>;
    fundLoan(loanId: number, lenderAddress: string): Promise<any>;
    repayLoan(loanId: number, farmerAddress: string): Promise<any>;
    claimDefault(loanId: number, lenderAddress: string): Promise<any>;
    getLoan(loanId: number): Promise<any>;
}
