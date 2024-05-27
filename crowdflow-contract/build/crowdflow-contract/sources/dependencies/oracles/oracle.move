/// Oracles module is responsible for fetching various token prices via multiple oracle services
/// 
/// There is one main operation in this module:
/// 
/// Implements two methods to fetch SUI price from Supra and Pyth oracles
/// Call either one of those methods in a single `get_sui_price` method
module oracles::oracle {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    
    use supra_holder::SupraSValueFeed::{Self, OracleHolder, get_price};

    // Supra_oracle sui pair code
    const SUPRA_SUI_USD_PAIR: u32 = 90;
    // Reduce to 9 decimal
    const SUI_FRACTION: u128 = 1_000_000_000;
    
    
    /// Take a live price of sui token from SupraOracle
    /// 
    /// # Arguments
    /// 
    /// `oracle_holder` - the share object of SupraOracle
    /// `storage` - the share object for return the price of sui token
    public fun get_supra_sui_price(oracle_holder: &OracleHolder) : u64 {
        // Take sui token price
        let (sui_usd_price, _, _, _) 
            = get_price(oracle_holder, SUPRA_SUI_USD_PAIR);
        // Assign the sui live price into our share object as u256 and 9 decimal
        ((sui_usd_price  / SUI_FRACTION) as u64) 

    }
    /// Get sui token live price from SupraOracle and pyth
    /// 
    /// # Arguments 
    ///
    /// `oracle_holder` - the share object of SupraOracle
    /// `storage` - the share object for return the price of sui token
    public fun get_sui_price(oracle_holder: &OracleHolder) : u64 {
        get_supra_sui_price(oracle_holder)
    }
}
