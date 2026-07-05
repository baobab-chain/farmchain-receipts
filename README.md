# FarmChain Receipts

**Tokenized warehouse receipts so smallholder farmers can use stored crops as verifiable collateral.**

Part of [Baobab Chain Labs](https://github.com/baobab-chain) — built on [Stellar](https://stellar.org).

---

## The problem

A smallholder farmer in Nigeria with 5 tons of maize sitting in a
certified warehouse has real, valuable collateral — but no way to prove
it to a lender. Paper warehouse receipts are easy to forge, hard to
verify remotely, and can't be checked by a lender who isn't local. So
farmers who could easily repay a short loan against stored inventory are
locked out of financing, and their crops sit un-monetized until sale.

Warehouse receipt financing is standard practice in developed
agricultural markets. The missing piece in Nigeria and much of West
Africa isn't the economic logic — it's a trustworthy, verifiable record.

## What this is

A Soroban protocol with two pieces:

1. **Receipts** — a certified warehouse operator issues an on-chain
   receipt recording crop type, quantity, grade, and storage location for
   a specific farmer. Anyone (a lender anywhere) can verify it instantly.
2. **Loans** — a farmer can lock a receipt as collateral and request
   financing. A lender funds the loan in USDC; if repaid on time, the
   receipt unlocks; if not, the lender can claim the underlying
   collateral.

## Why Stellar / Soroban

- **Verifiable by anyone, instantly** — a lender in Lagos or London can check a receipt's authenticity without calling the warehouse
- **USDC settlement** means a diaspora or international lender can fund a loan without a local bank relationship
- **Low fees** make small-ticket agricultural loans (which traditional finance treats as not worth the overhead) economically viable

## Status

Early-stage / MVP skeleton. Not audited. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the current design and
known gaps — in particular, **this version has no interest calculation
and no partial repayment**, both flagged as open issues.

## Repo layout

- **`contracts/farmchain-receipts/`** — the Soroban smart contract (Rust)
- **`api/`** — a NestJS REST layer over the contract
- **`web/`** — static landing page explaining the protocol

## Getting started

**Contract:**
```bash
cd contracts/farmchain-receipts
cargo build --target wasm32-unknown-unknown --release
cargo test
```

**API:**
```bash
cd api
npm install
cp .env.example .env
npm run start:dev
```

**Landing page:**
```bash
cd web
python3 -m http.server 8080
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to contribute.

## License

MIT — see [`LICENSE`](LICENSE).
