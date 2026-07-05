#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _, Env};

#[test]
fn test_full_receipt_and_loan_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let warehouse_operator = Address::generate(&env);
    let farmer = Address::generate(&env);
    let lender = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract(token_admin.clone());

    let contract_id = env.register_contract(None, FarmChainReceiptsContract);
    let client = FarmChainReceiptsContractClient::new(&env, &contract_id);

    let receipt_id = client.issue_receipt(
        &warehouse_operator,
        &farmer,
        &symbol_short!("MAIZE"),
        &5000_i128,
        &symbol_short!("GRADE_A"),
        &symbol_short!("LAGOS_WH1"),
    );

    let token_client = token::StellarAssetClient::new(&env, &token_id);
    token_client.mint(&lender, &1_000_000);

    let loan_id = client.request_loan(&farmer, &receipt_id, &token_id, &500_000_i128, &1000_u32);

    let receipt_after_lock = client.get_receipt(&receipt_id);
    assert!(receipt_after_lock.locked);

    client.fund_loan(&lender, &loan_id);
    client.repay_loan(&farmer, &loan_id);

    let receipt_after_repay = client.get_receipt(&receipt_id);
    assert!(!receipt_after_repay.locked);
}

// TODO: test request_loan fails if receipt already locked
// TODO: test fund_loan fails if already funded
// TODO: test claim_default succeeds after due_ledger passes and loan unpaid
// TODO: test claim_default fails before due_ledger

// TODO: test request_loan fails if receipt already locked
// TODO: test fund_loan fails if already funded
// TODO: test claim_default succeeds after due_ledger passes and loan unpaid
// TODO: test claim_default fails before due_ledger
