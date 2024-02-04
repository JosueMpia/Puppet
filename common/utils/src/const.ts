import * as viem from "viem"



export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000" as viem.Address
export const BYTES32_ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000" as viem.Hex

export const BASIS_POINTS_DIVISOR = 10000n

export const FACTOR_PERCISION = 30
export const USD_DECIMALS = 30
export const WEI_PRECISION = 10n ** BigInt(18)

export const PRECISION = 10n ** BigInt(FACTOR_PERCISION)

export const MAX_UINT256 = 2n ** 256n - 1n
