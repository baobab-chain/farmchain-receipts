import { ReceiptsService } from './receipts.service';
import { IssueReceiptDto } from './dto/receipts.dto';
export declare class ReceiptsController {
    private readonly receiptsService;
    constructor(receiptsService: ReceiptsService);
    issue(dto: IssueReceiptDto): Promise<any>;
    findOne(id: number): Promise<any>;
}
