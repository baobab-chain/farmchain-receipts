#![no_std]
//! FarmChain Receipts: tokenized warehouse receipts usable as loan
//! collateral. Early skeleton — see docs/ARCHITECTURE.md for known gaps
//! before using this with real funds or real collateral.

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, token, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Receipt {
    pub warehouse_operator: Address,
    pub farmer: Address,
    pub crop_type: Symbol,
    pub quantity_kg: i128,
    pub grade: Symbol,
    pub storage_location: Symbol,
    pub issued_at: u64,
    pub locked: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Loan {
    pub receipt_id: u32,
    pub farmer: Address,
    pub lender: Address,
    pub token: Address,
    pub amount: i128,
    pub due_ledger: u32,
    pub funded: bool,
    pub repaid: bool,
}

#[contracttype]
pub enum DataKey {
    Receipt(u32),
    NextReceiptId,
    Loan(u32),
    NextLoanId,
}

#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum Error {
    ReceiptNotFound = 1,
    LoanNotFound = 2,
    ReceiptAlreadyLocked = 3,
    NotFarmer = 4,
    NotLender = 5,
    AlreadyFunded = 6,
    NotYetFunded = 7,
    AlreadyRepaid = 8,
    NotYetDue = 9,
}

#[contract]
pub struct FarmChainReceiptsContract;

#[contractimpl]
impl FarmChainReceiptsContract {
    /// A warehouse operator issues a receipt for a farmer's stored crop.
    ///
    /// KNOWN GAP: anyone can currently call this as "warehouse_operator" —
    /// there's no registry verifying they actually operate a certified
    /// warehouse. See docs/ARCHITECTURE.md; this is the top-priority issue.
    pub fn issue_receipt(
        env: Env,
        warehouse_operator: Address,
        farmer: Address,
        crop_type: Symbol,
        quantity_kg: i128,
        grade: Symbol,
        storage_location: Symbol,
    ) -> u32 {
        warehouse_operator.require_auth();

        let receipt_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NextReceiptId)
            .unwrap_or(0);

        let receipt = Receipt {
            warehouse_operator,
            farmer,
            crop_type,
            quantity_kg,
            grade,
            storage_location,
            issued_at: env.ledger().timestamp(),
            locked: false,
        };

        env.storage().instance().set(&DataKey::Receipt(receipt_id), &receipt);
        env.storage()
            .instance()
            .set(&DataKey::NextReceiptId, &(receipt_id + 1));

        receipt_id
    }

    pub fn get_receipt(env: Env, receipt_id: u32) -> Result<Receipt, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Receipt(receipt_id))
            .ok_or(Error::ReceiptNotFound)
    }

    /// Farmer locks a receipt as collateral and requests a loan against it.
    pub fn request_loan(
        env: Env,
        farmer: Address,
        receipt_id: u32,
        token: Address,
        amount: i128,
        due_ledger: u32,
    ) -> Result<u32, Error> {
        farmer.require_auth();

        let mut receipt: Receipt = env
            .storage()
            .instance()
            .get(&DataKey::Receipt(receipt_id))
            .ok_or(Error::ReceiptNotFound)?;

        if receipt.farmer != farmer {
            return Err(Error::NotFarmer);
        }
        if receipt.locked {
            return Err(Error::ReceiptAlreadyLocked);
        }

        receipt.locked = true;
        env.storage().instance().set(&DataKey::Receipt(receipt_id), &receipt);

        let loan_id: u32 = env.storage().instance().get(&DataKey::NextLoanId).unwrap_or(0);
        // Placeholder lender until funded; overwritten in fund_loan.
        let loan = Loan {
            receipt_id,
            farmer: farmer.clone(),
            lender: farmer,
            token,
            amount,
            due_ledger,
            funded: false,
            repaid: false,
        };
        env.storage().instance().set(&DataKey::Loan(loan_id), &loan);
        env.storage().instance().set(&DataKey::NextLoanId, &(loan_id + 1));

        Ok(loan_id)
    }

    /// Lender funds a pending loan, transferring the amount to the farmer.
    pub fn fund_loan(env: Env, lender: Address, loan_id: u32) -> Result<(), Error> {
        lender.require_auth();

        let mut loan: Loan = env
            .storage()
            .instance()
            .get(&DataKey::Loan(loan_id))
            .ok_or(Error::LoanNotFound)?;

        if loan.funded {
            return Err(Error::AlreadyFunded);
        }

        let token_client = token::Client::new(&env, &loan.token);
        token_client.transfer(&lender, &loan.farmer, &loan.amount);

        loan.lender = lender;
        loan.funded = true;
        env.storage().instance().set(&DataKey::Loan(loan_id), &loan);

        Ok(())
    }

    /// Farmer repays the loan in full; the underlying receipt unlocks.
    ///
    /// KNOWN GAP: no interest — this transfers exactly `amount` back, no more.
    pub fn repay_loan(env: Env, farmer: Address, loan_id: u32) -> Result<(), Error> {
        farmer.require_auth();

        let mut loan: Loan = env
            .storage()
            .instance()
            .get(&DataKey::Loan(loan_id))
            .ok_or(Error::LoanNotFound)?;

        if !loan.funded {
            return Err(Error::NotYetFunded);
        }
        if loan.repaid {
            return Err(Error::AlreadyRepaid);
        }

        let token_client = token::Client::new(&env, &loan.token);
        token_client.transfer(&farmer, &loan.lender, &loan.amount);

        loan.repaid = true;
        env.storage().instance().set(&DataKey::Loan(loan_id), &loan);

        let mut receipt: Receipt = env
            .storage()
            .instance()
            .get(&DataKey::Receipt(loan.receipt_id))
            .ok_or(Error::ReceiptNotFound)?;
        receipt.locked = false;
        env.storage().instance().set(&DataKey::Receipt(loan.receipt_id), &receipt);

        Ok(())
    }

    /// If the due ledger has passed and the loan is unpaid, the lender can
    /// claim the underlying receipt (collateral transfers to the lender).
    pub fn claim_default(env: Env, lender: Address, loan_id: u32) -> Result<(), Error> {
        lender.require_auth();

        let loan: Loan = env
            .storage()
            .instance()
            .get(&DataKey::Loan(loan_id))
            .ok_or(Error::LoanNotFound)?;

        if loan.lender != lender {
            return Err(Error::NotLender);
        }
        if loan.repaid {
            return Err(Error::AlreadyRepaid);
        }
        if env.ledger().sequence() < loan.due_ledger {
            return Err(Error::NotYetDue);
        }

        let mut receipt: Receipt = env
            .storage()
            .instance()
            .get(&DataKey::Receipt(loan.receipt_id))
            .ok_or(Error::ReceiptNotFound)?;
        receipt.farmer = lender;
        receipt.locked = false;
        env.storage().instance().set(&DataKey::Receipt(loan.receipt_id), &receipt);

        Ok(())
    }

    pub fn get_loan(env: Env, loan_id: u32) -> Result<Loan, Error> {
        env.storage().instance().get(&DataKey::Loan(loan_id)).ok_or(Error::LoanNotFound)
    }
}

mod test;
