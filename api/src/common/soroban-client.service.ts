import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Contract,
  Keypair,
  rpc,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';

/**
 * Shared helper for invoking the FarmChain Receipts Soroban contract.
 *
 * IMPORTANT — same caveat as diaspora-circle's API: this signs
 * transactions with a single service keypair, which is fine for a
 * testnet demo but not how `request_loan`/`repay_loan` should work in
 * production, since those actions need the farmer's own authorization,
 * not a shared service key. See ISSUES.md.
 */
@Injectable()
export class SorobanClientService {
  private readonly logger = new Logger(SorobanClientService.name);
  private readonly server: rpc.Server;
  private readonly contractId: string;
  private readonly networkPassphrase: string;
  private readonly serviceKeypair: Keypair;

  constructor(private readonly config: ConfigService) {
    this.server = new rpc.Server(
      this.config.get<string>('SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org'),
    );
    this.contractId = this.config.getOrThrow<string>('CONTRACT_ID');
    this.networkPassphrase = this.config.get<string>('NETWORK_PASSPHRASE', Networks.TESTNET);
    const secret = this.config.getOrThrow<string>('SERVICE_ACCOUNT_SECRET');
    this.serviceKeypair = Keypair.fromSecret(secret);
  }

  async invoke(method: string, args: ReturnType<typeof nativeToScVal>[]) {
    const contract = new Contract(this.contractId);
    const account = await this.server.getAccount(this.serviceKeypair.publicKey());

    let tx = new TransactionBuilder(account, {
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

  private async pollForResult(hash: string) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const tx = await this.server.getTransaction(hash);
      if (tx.status === 'SUCCESS') {
        return tx.returnValue ? scValToNative(tx.returnValue) : null;
      }
      if (tx.status === 'FAILED') {
        throw new Error(`Transaction ${hash} failed`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error(`Timed out waiting for transaction ${hash}`);
  }

  get servicePublicKey(): string {
    return this.serviceKeypair.publicKey();
  }
}
