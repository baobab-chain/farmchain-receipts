# ADR 001: Open receipt issuance for now, registry planned as v2

## Status
Accepted (temporary — revisit before any real-money use)

## Context
`issue_receipt` currently lets any address call it as the warehouse
operator. This is fine for demoing the collateral/loan mechanics on
testnet, but it means the contract currently has **no actual trust
guarantee** that a receipt represents real, physically stored crop.

## Decision
Ship the MVP without a warehouse operator registry, but treat adding one
as the single highest-priority pre-production issue (see `ISSUES.md`).
The registry should likely:
- Require warehouse operators to be added by a multi-sig admin or DAO-style vote, not a single owner
- Possibly integrate an off-chain attestation (inspection reports, licensing) surfaced on-chain via oracle
- Be a separate contract or module so it can evolve independently of the loan mechanics

## Consequences
- Anyone testing/contributing right now can issue fake receipts — expected and fine for testnet
- This contract must not be used to back real financing until the registry exists
- Every README/API doc references this limitation explicitly, so no one mistakes the MVP for production-ready
