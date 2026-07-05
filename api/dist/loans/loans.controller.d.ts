import { LoansService } from './loans.service';
import { RequestLoanDto, FundLoanDto, RepayLoanDto, ClaimDefaultDto } from './dto/loans.dto';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    request(dto: RequestLoanDto): Promise<any>;
    findOne(id: number): Promise<any>;
    fund(id: number, dto: FundLoanDto): Promise<any>;
    repay(id: number, dto: RepayLoanDto): Promise<any>;
    claimDefault(id: number, dto: ClaimDefaultDto): Promise<any>;
}
