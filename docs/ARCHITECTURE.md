# Architecture

## Core concepts

**Receipt** — an on-chain record issued by a warehouse operator,
representing a specific farmer's stored crop: type, quantity, grade,
storage location, and issue date.

**Loan** — a financing agreement collateralized by a receipt. A farmer
requests a loan against a receipt they hold; a lender funds it; the
farmer repays by a due ledger, or the lender can claim the collateral.

## Contract lifecycle (current skeleton)

1. `issue_receipt(warehouse_operator, farmer, crop_type, quantity_kg, grade, storage_location)` —
   warehouse operator issues a receipt. Returns a `receipt_id`.
2. `request_loan(farmer, receipt_id, token, amount, due_ledger)` — farmer
   locks their receipt as collateral and requests financing. Returns a `loan_id`.
3. `fund_loan(lender, loan_id)` — lender transfers the loan amount to the
   farmer, marking the loan funded.
4. `repay_loan(farmer, loan_id)` — farmer transfers the amount back to the
   lender; the receipt unlocks.
5. `claim_default(lender, loan_id)` — if the due ledger has passed and the
   loan isn't repaid, the lender can claim the underlying receipt
   (ownership transfers to the lender).

## Known gaps (help wanted)

- **No interest calculation.** `repay_loan` currently requires exactly the
  principal amount back — no interest or fee model exists yet. This is
  the highest-value missing piece; see the issues list.
- **No partial repayment.** A farmer must repay the full amount at once.
- **No warehouse operator registry/verification.** Anyone can currently
  call `issue_receipt` — there's no on-chain concept of "certified
  warehouse operator" yet, which is essential before this could be
  trusted with real financing. This is a prerequisite for any real use
  and is the single most important open issue.
- **No partial receipt quantities.** A receipt can't currently be split
  (e.g. using part of a stored batch as collateral while selling the
  rest).
- **No audit.** Do not use this contract to hold real funds or represent
  real collateral until it has had a security review.

## Why a simple fixed-due-ledger loan model (for now)

Real agricultural lending often has grace periods, partial harvest-linked
repayment schedules, and renegotiation. The skeleton intentionally starts
with a strict fixed-due-ledger, full-repayment model to keep the trust
model auditable before adding flexibility. More realistic repayment
terms are a planned v2, not in scope yet.
