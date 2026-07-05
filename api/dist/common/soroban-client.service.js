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
var SorobanClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorobanClientService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
let SorobanClientService = SorobanClientService_1 = class SorobanClientService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SorobanClientService_1.name);
        this.server = new stellar_sdk_1.rpc.Server(this.config.get('SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'));
        this.contractId = this.config.getOrThrow('CONTRACT_ID');
        this.networkPassphrase = this.config.get('NETWORK_PASSPHRASE', stellar_sdk_1.Networks.TESTNET);
        const secret = this.config.getOrThrow('SERVICE_ACCOUNT_SECRET');
        this.serviceKeypair = stellar_sdk_1.Keypair.fromSecret(secret);
    }
    async invoke(method, args) {
        const contract = new stellar_sdk_1.Contract(this.contractId);
        const account = await this.server.getAccount(this.serviceKeypair.publicKey());
        let tx = new stellar_sdk_1.TransactionBuilder(account, {
            fee: '100000',
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(contract.call(method, ...args))
            .setTimeout(30)
            .build();
        tx = await this.server.prepareTransaction(tx);
        tx.sign(this.serviceKeypair);
        const result = await this.server.sendTransaction(tx);
        if (result.status === 'ERROR') {
            this.logger.error(`Contract call ${method} failed`, result.errorResult);
            throw new Error(`Contract call ${method} failed`);
        }
        return this.pollForResult(result.hash);
    }
    async pollForResult(hash) {
        for (let attempt = 0; attempt < 10; attempt++) {
            const tx = await this.server.getTransaction(hash);
            if (tx.status === 'SUCCESS') {
                return tx.returnValue ? (0, stellar_sdk_1.scValToNative)(tx.returnValue) : null;
            }
            if (tx.status === 'FAILED') {
                throw new Error(`Transaction ${hash} failed`);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        throw new Error(`Timed out waiting for transaction ${hash}`);
    }
    get servicePublicKey() {
        return this.serviceKeypair.publicKey();
    }
};
exports.SorobanClientService = SorobanClientService;
exports.SorobanClientService = SorobanClientService = SorobanClientService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SorobanClientService);
//# sourceMappingURL=soroban-client.service.js.map