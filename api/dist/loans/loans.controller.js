"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansController = void 0;
const common_1 = require("@nestjs/common");
const loans_service_1 = require("./loans.service");
const loans_dto_1 = require("./dto/loans.dto");
let LoansController = class LoansController {
    constructor(loansService) {
        this.loansService = loansService;
    }
    request(dto) {
        return this.loansService.requestLoan(dto.farmerAddress, dto.receiptId, dto.tokenContractId, dto.amount, dto.dueLedger);
    }
    findOne(id) {
        return this.loansService.getLoan(id);
    }
    fund(id, dto) {
        return this.loansService.fundLoan(id, dto.lenderAddress);
    }
    repay(id, dto) {
        return this.loansService.repayLoan(id, dto.farmerAddress);
    }
    claimDefault(id, dto) {
        return this.loansService.claimDefault(id, dto.lenderAddress);
    }
};
exports.LoansController = LoansController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loans_dto_1.RequestLoanDto]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "request", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/fund'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, loans_dto_1.FundLoanDto]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "fund", null);
__decorate([
    (0, common_1.Post)(':id/repay'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, loans_dto_1.RepayLoanDto]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "repay", null);
__decorate([
    (0, common_1.Post)(':id/claim-default'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, loans_dto_1.ClaimDefaultDto]),
    __metadata("design:returntype", void 0)
], LoansController.prototype, "claimDefault", null);
exports.LoansController = LoansController = __decorate([
    (0, common_1.Controller)('loans'),
    __metadata("design:paramtypes", [loans_service_1.LoansService])
], LoansController);
//# sourceMappingURL=loans.controller.js.map