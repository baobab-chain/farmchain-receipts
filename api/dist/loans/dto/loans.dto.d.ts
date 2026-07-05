export declare class RequestLoanDto {
    farmerAddress: string;
    receiptId: number;
    tokenContractId: string;
    amount: number;
    dueLedger: number;
}
export declare class FundLoanDto {
    lenderAddress: string;
}
export declare class RepayLoanDto {
    farmerAddress: string;
}
export declare class ClaimDefaultDto {
    lenderAddress: string;
}
