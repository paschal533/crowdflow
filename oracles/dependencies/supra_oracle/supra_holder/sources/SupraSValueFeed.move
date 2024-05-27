module supra_holder::SupraSValueFeed {

    use std::vector;
    use supra_utils::utils;
    use sui::object::{UID, ID};
    use sui::table::Table;
    #[test_only]
    use sui::object;
    #[test_only]
    use sui::tx_context;
    #[test_only]
    use sui::transfer;
    use sui::table;

    // Track the current version of the module
    const VERSION: u64 = 1;

    /// User Requesting for invalid pair or subscription
    const EINVALID_PAIR: u64 = 1;
    /// Calling functions from the wrong package version
    const EWRONG_ORACLE_HOLDER_VERSION: u64 = 2;
    /// PairId1 and PairId2 should not be same
    const EPAIR_ID_SAME: u64 = 5;
    /// Invalid Operation, it should be 0 => Multiplication || 1 => Division
    const EINVALID_OPERATION: u64 = 6;
    /// Invalid decimal, it should not be more than [MAX_DECIMAL]
    const EINVALID_DECIMAL: u64 = 7;

    /// Keeping the decimal for the derived prices as 18
    const MAX_DECIMAL: u16 = 18;

    /// Capability that grants an owner the right to perform action.
    struct HolderOwnerCap has key { id: UID }

    struct OracleHolder has key, store {
        id: UID,
        version: u64,
        owner: ID,
        feeds: Table<u32, Entry>
    }

    struct Entry has drop, store {
        value: u128,
        decimal: u16,
        timestamp: u128,
        round: u64,
    }

    struct Price has drop {
        pair: u32,
        value: u128,
        decimal: u16,
        timestamp: u128,
        round: u64
    }

    /// External public function
    /// It will return the priceFeedData value for that particular tradingPair
    public fun get_price(oracle_holder: &OracleHolder, pair: u32) : (u128, u16, u128, u64) {
        assert!(oracle_holder.version == VERSION, EWRONG_ORACLE_HOLDER_VERSION);
        let feed = table::borrow(&oracle_holder.feeds, pair);
        (feed.value, feed.decimal, feed.timestamp, feed.round)
    }


    /// Function which checks that is pair index is exist in OracleHolder
    public fun is_pair_exist(oracle_holder: &OracleHolder, pair_index: u32) : bool {
        table::contains(&oracle_holder.feeds, pair_index)
    }

    /// External public function
    /// It will return the priceFeedData value for that multiple tradingPair
    public fun get_prices(oracle_holder: &OracleHolder, pairs: vector<u32>) : vector<Price> {
        assert!(oracle_holder.version == VERSION, EWRONG_ORACLE_HOLDER_VERSION);
        let prices: vector<Price> = vector::empty();

        while(!vector::is_empty(&pairs)) {
            let pair = vector::pop_back(&mut pairs);
            if (is_pair_exist(oracle_holder, pair)) {
                let feed = table::borrow(&oracle_holder.feeds, pair);
                vector::push_back(&mut prices, Price { pair, value: feed.value, decimal: feed.decimal, timestamp: feed.timestamp, round: feed.round });
            };
        };
        prices
    }

    /// External public function.
    /// This function will help to find the prices of the derived pairs
    /// Derived pairs are the one whose price info is calculated using two compatible pairs using either multiplication or division.
    /// Return values in tuple
    ///     1. derived_price : u32
    ///     2. decimal : u16
    ///     3. round-difference : u64
    ///     4. `"pair_id1" as compared to "pair_id2"` : u8 (Where 0=>EQUAL, 1=>LESS, 2=>GREATER)
    public fun get_derived_price(oracle_holder: &OracleHolder, pair_id1: u32, pair_id2: u32, operation: u8) : (u128, u16, u64, u8) {
        assert!(oracle_holder.version == VERSION, EWRONG_ORACLE_HOLDER_VERSION);
        assert!(pair_id1 != pair_id2, EPAIR_ID_SAME);
        assert!((operation <=1), EINVALID_OPERATION);

        let (value1, decimal1, _timestamp1, round1) = get_price(oracle_holder, pair_id1);
        let (value2, decimal2, _timestamp2, round2) = get_price(oracle_holder, pair_id2);
        let value1 = (value1 as u256);
        let value2 = (value2 as u256);

        // used variable name with `_` to remove compilation warning
        let _derived_price: u256 = 0;

        // operation 0 it means multiplication
        if (operation == 0) {
            let sum_decimal_1_2 = decimal1 + decimal2;
            if (sum_decimal_1_2 > MAX_DECIMAL) {
                _derived_price = (value1 * value2) / (utils::calculate_power(10, (sum_decimal_1_2 - MAX_DECIMAL)));
            } else {
                _derived_price = (value1 * value2) * (utils::calculate_power(10, (MAX_DECIMAL - sum_decimal_1_2)));
            }
        } else {
            _derived_price = (scale_price(value1, decimal1) * (utils::calculate_power(10, MAX_DECIMAL))) / scale_price(value2, decimal2)
        };

        let base_compare_to_quote = 0; // default consider as equal
        let round_difference = if (round1 > round2) {
            base_compare_to_quote = 2;
            round1 - round2
        } else if (round1 < round2) {
            base_compare_to_quote = 1;
            round2 - round1
        } else { 0 };
        ((_derived_price as u128), MAX_DECIMAL, round_difference, base_compare_to_quote)
    }

    /// Scales a price value by adjusting its decimal precision.
    fun scale_price(price: u256, decimal: u16): u256 {
        assert!(decimal <= MAX_DECIMAL, EINVALID_DECIMAL);
        if (decimal == MAX_DECIMAL) { price }
        else { price * (utils::calculate_power(10, (MAX_DECIMAL - decimal))) }
    }

    /// External public function
    /// It will return the extracted price value for the Price struct
    public fun extract_price(price: &Price): (u32, u128, u16, u128, u64) {
        (price.pair, price.value, price.decimal, price.timestamp, price.round)
    }

    #[test_only]
    public fun create_oracle_holder_for_test(ctx: &mut sui::tx_context::TxContext) {
        let holder_owner_cap = HolderOwnerCap { id: object::new(ctx) };
        let oracle_holder = OracleHolder { id: object::new(ctx), owner: object::id(&holder_owner_cap), version: 1, feeds: table::new(ctx) };
        transfer::transfer(holder_owner_cap, tx_context::sender(ctx));
        transfer::share_object(oracle_holder);
    }

    #[test_only]
    public fun add_pair_data(oracle_holder: &mut OracleHolder, pair: u32, value: u128, decimal: u16, timestamp: u128, round: u64) {
        let entry = Entry { value, decimal, timestamp, round };
        if (table::contains(&oracle_holder.feeds, pair)) {
            let feed = table::borrow_mut(&mut oracle_holder.feeds, pair);
            *feed = entry;
        } else {
            table::add(&mut oracle_holder.feeds, pair, entry);
        }
    }
}
