module fungible_tokens::token {
    use std::option;
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::balance::{Self, Balance};
    use sui::object::UID;

    public fun create_currency<T: drop>(
        witness: T,
        name: vector<u8>,
        symbol: vector<u8>,
        ctx: &mut TxContext
    ): (coin::TreasuryCap<T>, coin::CoinMetadata<T>) {
        let (treasury, metadata) = coin::create_currency(witness, 9, symbol, name, b"", option::none(), ctx);
        (treasury, metadata)
    }

    public entry fun mint<T: drop>(
        treasury: &mut coin::TreasuryCap<T>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury, amount, recipient, ctx)
    }

    public entry fun burn<T: drop>(treasury: &mut coin::TreasuryCap<T>, coin: coin::Coin<T>) {
        coin::burn(treasury, coin);
    }
}
