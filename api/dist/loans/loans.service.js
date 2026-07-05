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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const soroban_client_service_1 = require("../common/soroban-client.service");
let LoansService = class LoansService {
    constructor(soroban) {
        this.soroban = soroban;
    }
    async requestLoan(farmerAddress, receiptId, tokenContractId, amount, dueLedger) {
        return this.soroban.invoke('request_loan', [
            (0, stellar_sdk_1.nativeToScVal)(farmerAddress, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(receiptId, { type: 'u32' }),
            (0, stellar_sdk_1.nativeToScVal)(tokenContractId, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(amount, { type: 'i128' }),
            (0, stellar_sdk_1.nativeToScVal)(dueLedger, { type: 'u32' }),
        ]);
    }
    async fundLoan(loanId, lenderAddress) {
        return this.soroban.invoke('fund_loan', [
            (0, stellar_sdk_1.nativeToScVal)(lenderAddress, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(loanId, { type: 'u32' }),
        ]);
    }
    async repayLoan(loanId, farmerAddress) {
        return this.soroban.invoke('repay_loan', [
            (0, stellar_sdk_1.nativeToScVal)(farmerAddress, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(loanId, { type: 'u32' }),
        ]);
    }
    async claimDefault(loanId, lenderAddress) {
        return this.soroban.invoke('claim_default', [
            (0, stellar_sdk_1.nativeToScVal)(lenderAddress, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(loanId, { type: 'u32' }),
        ]);
    }
    async getLoan(loanId) {
        return this.soroban.invoke('get_loan', [(0, stellar_sdk_1.nativeToScVal)(loanId, { type: 'u32' })]);
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [soroban_client_service_1.SorobanClientService])
], LoansService);
//# sourceMappingURL=loans.service.js.map