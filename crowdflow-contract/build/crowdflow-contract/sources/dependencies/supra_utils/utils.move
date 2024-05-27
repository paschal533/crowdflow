module supra_utils::utils {

    /// Undefined expression
    const EUNDEFIND_EXP: u64 = 1;

    /// Calculates the power of a base raised to an exponent. The result of `base` raised to the power of `exponent`
    public fun calculate_power(base: u128, exponent: u16): u256 {
        let result: u256 = 1;
        let base: u256 = (base as u256);
        assert!((base | (exponent as u256)) != 0, EUNDEFIND_EXP);
        if (base == 0) { return 0 };
        while(exponent != 0) {
            if ((exponent & 0x1) == 1) { result = result * base; };
            base = base * base;
            exponent = (exponent >> 1);
        };
        result
    }
}
