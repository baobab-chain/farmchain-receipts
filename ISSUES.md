# Initial issues (paste each of these as a separate GitHub issue)

---

## 1. Warehouse operator registry (top priority)

**Labels:** `complexity: high`, `contract-logic`, `help wanted`, `priority: high`

Per `docs/adr/001-warehouse-operator-trust.md`, `issue_receipt` currently
trusts any caller as a legitimate warehouse operator. This is the single
most important gap before this protocol could back real financing.

**Acceptance criteria:**
- Design proposal posted as a comment on this issue before implementation (affects trust model significantly)
- A registry contract/module tracking approved warehouse operator addresses
- `issue_receipt` checks the caller against the registry and rejects unapproved callers
- Tests covering both approved and rejected issuance attempts

---

## 2. Add interest calculation to loans

**Labels:** `complexity: medium`, `contract-logic`

`repay_loan` currently requires exactly the principal back. Real lending
needs an interest model.

**Acceptance criteria:**
- Add an `interest_rate` (basis points) field to `Loan`, set at `request_loan` time
- `repay_loan` requires principal + accrued interest based on time elapsed
- Tests covering repayment amount at various elapsed durations

---

## 3. Tests for rejected paths

**Labels:** `good-first-issue`, `complexity: trivial`, `tests`

**Acceptance criteria:**
- Test `request_loan` fails with `ReceiptAlreadyLocked` on an already-locked receipt
- Test `fund_loan` fails with `AlreadyFunded` if called twice
- Test `claim_default` fails with `NotYetDue` before the due ledger
- Test `claim_default` succeeds after the due ledger if unpaid

---

## 4. Partial repayment support

**Labels:** `complexity: medium`, `contract-logic`

Farmers may want to repay a loan in installments rather than one lump sum.

**Acceptance criteria:**
- `repay_loan` accepts an `amount` parameter instead of requiring the full balance
- Track `amount_repaid` on `Loan`; receipt only unlocks once fully repaid
- Tests covering multiple partial repayments summing to the full amount

---

## 5. Minimal CLI/script to issue a test receipt and run a full loan cycle on testnet

**Labels:** `good-first-issue`, `complexity: trivial`, `tooling`

**Acceptance criteria:**
- Script in `scripts/` deploying the contract to testnet, issuing a receipt, requesting/funding/repaying a loan with generated test accounts
- Documented in `docs/` with exact commands
- README updated to link to it under "Getting started"

---

## 6. Receipt splitting for partial collateral use

**Labels:** `complexity: high`, `contract-logic`, `discussion`

A farmer with a 5-ton receipt might want to use only 2 tons as collateral
while selling the rest. Currently a receipt is all-or-nothing.

**Acceptance criteria:**
- Design discussion posted first (this changes core data model)
- Proposal for how `Receipt.quantity_kg` splits into a locked and unlocked portion
- Implementation and tests once design is agreed
