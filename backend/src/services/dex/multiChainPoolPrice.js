const { ethers } = require("ethers");

const UNISWAP_V2_PAIR_ABI = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
];

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// RPC map by chain name
const PROVIDERS = {
  ethereum: new ethers.JsonRpcProvider(process.env.ETH_RPC_URL),
  polygon: new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL),
  bsc: new ethers.JsonRpcProvider(process.env.BSC_RPC_URL),
  avalanche: new ethers.JsonRpcProvider(process.env.AVAX_RPC_URL),
  fantom: new ethers.JsonRpcProvider(process.env.FANTOM_RPC_URL),
};

async function getPoolPrice(chain, poolAddress) {
  if (!PROVIDERS[chain]) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const provider = PROVIDERS[chain];
  const pool = new ethers.Contract(poolAddress, UNISWAP_V2_PAIR_ABI, provider);

  const [reserve0, reserve1] = await pool.getReserves();
  const token0Addr = await pool.token0();
  const token1Addr = await pool.token1();

  const token0 = new ethers.Contract(token0Addr, ERC20_ABI, provider);
  const token1 = new ethers.Contract(token1Addr, ERC20_ABI, provider);

  const [dec0, dec1, sym0, sym1] = await Promise.all([
    token0.decimals(),
    token1.decimals(),
    token0.symbol(),
    token1.symbol()
  ]);

  // Convert safely using ethers.formatUnits
  const normReserve0 = parseFloat(ethers.formatUnits(reserve0, dec0));
  const normReserve1 = parseFloat(ethers.formatUnits(reserve1, dec1));

  return {
    chain,
    pool: poolAddress,
    token0: sym0,
    token1: sym1,
    reserve0: normReserve0,
    reserve1: normReserve1,
    price0in1: normReserve1 / normReserve0,
    price1in0: normReserve0 / normReserve1,
  };
}

module.exports = { getPoolPrice };
