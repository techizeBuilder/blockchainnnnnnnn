// src/constants/dexMap.ts
export const DEX_MAP: Record<string, { name: string; logo: string }> = {
	sushiswap: {
		name: "SushiSwap",
		logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png", // SUSHI token logo
	},
	curve: {
		name: "Curve",
		logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png", // CRV token logo
	},
	uniswap: {
		name: "Uniswap",
		logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png", // UNI token logo
	},
};
