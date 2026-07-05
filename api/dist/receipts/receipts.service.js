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
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const soroban_client_service_1 = require("../common/soroban-client.service");
let ReceiptsService = class ReceiptsService {
    constructor(soroban) {
        this.soroban = soroban;
    }
    async issueReceipt(farmerAddress, cropType, quantityKg, grade, storageLocation) {
        return this.soroban.invoke('issue_receipt', [
            (0, stellar_sdk_1.nativeToScVal)(this.soroban.servicePublicKey, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(farmerAddress, { type: 'address' }),
            (0, stellar_sdk_1.nativeToScVal)(cropType, { type: 'symbol' }),
            (0, stellar_sdk_1.nativeToScVal)(quantityKg, { type: 'i128' }),
            (0, stellar_sdk_1.nativeToScVal)(grade, { type: 'symbol' }),
            (0, stellar_sdk_1.nativeToScVal)(storageLocation, { type: 'symbol' }),
        ]);
    }
    async getReceipt(receiptId) {
        return this.soroban.invoke('get_receipt', [(0, stellar_sdk_1.nativeToScVal)(receiptId, { type: 'u32' })]);
    }
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [soroban_client_service_1.SorobanClientService])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map