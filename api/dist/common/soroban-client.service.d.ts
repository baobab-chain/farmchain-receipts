import { ConfigService } from '@nestjs/config';
import { nativeToScVal } from '@stellar/stellar-sdk';
export declare class SorobanClientService {
    private readonly config;
    private readonly logger;
    private readonly server;
    private readonly contractId;
    private readonly networkPassphrase;
    private readonly serviceKeypair;
    constructor(config: ConfigService);
    invoke(method: string, args: ReturnType<typeof nativeToScVal>[]): Promise<any>;
    private pollForResult;
    get servicePublicKey(): string;
}
