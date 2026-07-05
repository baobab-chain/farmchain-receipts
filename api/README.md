# FarmChain Receipts API

A NestJS REST layer over the FarmChain Receipts Soroban contract.

## ⚠️ Before you use this for anything real

This is a **testnet demo scaffold**. `issue_receipt` is called with the
service account as the warehouse operator — meaning right now there's no
real verification that a warehouse operator is legitimate (see
`docs/adr/001-warehouse-operator-trust.md` in the repo root). Similarly,
`request_loan`/`repay_loan` should eventually be signed by the farmer's
own wallet, not this service's shared key. Both are tracked in
`ISSUES.md` as high-value contributions.

## Setup

```bash
cd api
npm install
cp .env.example .env
# fill in CONTRACT_ID (from deploying the contract) and SERVICE_ACCOUNT_SECRET
npm run start:dev
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/receipts` | Issue a warehouse receipt. Body: `{ farmerAddress, cropType, quantityKg, grade, storageLocation }` |
| `GET` | `/receipts/:id` | Fetch a receipt |
| `POST` | `/loans` | Request a loan against a receipt. Body: `{ farmerAddress, receiptId, tokenContractId, amount, dueLedger }` |
| `GET` | `/loans/:id` | Fetch loan state |
| `POST` | `/loans/:id/fund` | Lender funds the loan. Body: `{ lenderAddress }` |
| `POST` | `/loans/:id/repay` | Farmer repays the loan. Body: `{ farmerAddress }` |
| `POST` | `/loans/:id/claim-default` | Lender claims collateral after due ledger passes unpaid. Body: `{ lenderAddress }` |

## Generating a testnet service account

```bash
node -e "console.log(require('@stellar/stellar-sdk').Keypair.random().secret())"
```

Fund it via [Friendbot](https://friendbot.stellar.org) before use.
