import { useNetwork } from "@/lib/networkContext";
import { useEffect, useState, useRef } from "react";
import Request from "@/lib/apiCall";
import { DEX_MAP } from "@/constants/dexMap";

interface Pool {
	id: string;
	address: string;
	name: string;
	dex: string;
	priceUsd: string;
	liquidityUsd: number;
	volume24h: number;
	baseToken?: string;
	quoteToken?: string;
}

interface UniPool {
	address: string;
	baseToken: string;
	dex: string;
	liquidityUsd: string;
	priceUsd: string;
	quoteToken: string;
}

interface PairData {
	opportunities: UniPool[];
	priceDiff: number;
}

interface UniResponse {
	chain: string;
	pairs: Record<string, PairData>;
}

interface DexData {
	dexId: string;
	pools: Pool[];
}

const DecXPage = () => {
	const { selectedNetwork } = useNetwork();
	const [allDexData, setAllDexData] = useState<Record<string, Pool[]>>({});
	const [selectedDex, setSelectedDex] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// keep track if it's the first load
	const firstLoad = useRef(true);

	// Fetch pools for a specific DEX
	// Fetch pools for a specific DEX
	const fetchDexPools = async (dexId: string): Promise<DexData> => {
		try {
			// For Uniswap, use the new endpoint
			if (dexId.toLowerCase() === "uniswap") {
				const response = await Request.get<UniResponse>("/pairs/eth");
				const uniPools: Pool[] = [];

				console.log("Uniswap Response ==", response);

				// Transform the UniResponse format to match Pool interface
				Object.entries(response.data.pairs).forEach(([pairName, pairData]) => {
					// Check if opportunities array exists
					if (pairData.opportunities && Array.isArray(pairData.opportunities)) {
						pairData.opportunities.forEach((pool, index) => {
							// Only include pools from uniswap_v3
							if (pool.dex === "uniswap_v3") {
								uniPools.push({
									id: `uni_${pool.address}_${index}`,
									address: pool.address,
									name: pairName,
									dex: "uniswap",
									priceUsd: pool.priceUsd,
									liquidityUsd: parseFloat(pool.liquidityUsd),
									volume24h: 0, // Not available in the new API
									baseToken: pool.baseToken,
									quoteToken: pool.quoteToken,
								});
							}
						});
					}
				});

				console.log("Filtered Uniswap Pools:", uniPools);
				return { dexId, pools: uniPools };
			} else {
				// For other DEXes, use the original endpoint
				const response = await Request.get(`/prices/ethereum`);
				const filteredPools = (response.data || []).filter(
					(pool: Pool) => pool.dex.toLowerCase() === dexId.toLowerCase()
				);
				return { dexId, pools: filteredPools };
			}
		} catch (err) {
			console.error(`Error fetching pools for ${dexId}:`, err);
			return { dexId, pools: [] };
		}
	};

	// Fetch all DEX data on initial load
	const fetchAllDexData = async () => {
		if (firstLoad.current) setLoading(true);
		setError(null);

		try {
			const dexIds = Object.keys(DEX_MAP);
			const promises = dexIds.map((dexId) => fetchDexPools(dexId));

			const results = await Promise.all(promises);

			// Convert array of results to object keyed by dexId
			const dexDataMap: Record<string, Pool[]> = {};
			results.forEach((result) => {
				dexDataMap[result.dexId] = result.pools;
			});

			setAllDexData(dexDataMap);
		} catch (err) {
			console.error("Error fetching all DEX data:", err);
			setError("Failed to fetch pools data.");
		} finally {
			setLoading(false);
			firstLoad.current = false;
		}
	};

	// Fetch single DEX data (for refresh)
	const fetchSingleDex = async (dexId: string) => {
		try {
			const result = await fetchDexPools(dexId);
			setAllDexData((prev) => ({
				...prev,
				[dexId]: result.pools,
			}));
		} catch (err) {
			console.error(`Error refreshing ${dexId}:`, err);
		}
	};

	const getDexLogo = (dexId: string) => {
		return DEX_MAP[dexId]?.logo || "https://via.placeholder.com/40?text=DEX";
	};

	const getDexName = (dexId: string) => {
		return DEX_MAP[dexId]?.name || dexId;
	};

	// Get pools for selected DEX
	const getSelectedPools = (): Pool[] => {
		if (!selectedDex) return [];
		return allDexData[selectedDex] || [];
	};

	// initial load - fetch all DEX data
	useEffect(() => {
		if (selectedNetwork.name.toLowerCase() === "ethereum") {
			fetchAllDexData();
		}
	}, [selectedNetwork]);

	// auto refresh for selected DEX
	useEffect(() => {
		if (selectedDex) {
			// set up interval to refresh selected DEX every 30s
			const interval = setInterval(() => {
				fetchSingleDex(selectedDex);
			}, Number(import.meta.env.VITE_DEX_REFRESH_INTERVAL));

			return () => clearInterval(interval);
		}
	}, [selectedDex]);

	// Show loading state only on first load when no data exists
	const showLoading = loading && Object.keys(allDexData).length === 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full mb-4 animate-pulse">
						Decentralized Exchange Explorer
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						{selectedDex ? "Discover Liquidity Pools" : "Select a DEX"}
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						{selectedDex
							? "Explore live pool data from the selected decentralized exchange."
							: "Choose a DEX to explore its liquidity pools."}
					</p>
				</div>

				{selectedNetwork.name.toLowerCase() !== "ethereum" ? (
					<div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
						<p className="text-2xl font-semibold">
							🚀 {selectedNetwork.name} integration coming soon!
						</p>
					</div>
				) : error ? (
					<div className="text-center text-red-500 mt-10">{error}</div>
				) : showLoading ? (
					// Show loading state only when no data loaded yet
					<div className="flex flex-col items-center justify-center h-[60vh]">
						<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
						<p className="text-lg text-gray-600">Loading All DEX Data...</p>
					</div>
				) : !selectedDex ? (
					// Show DEX selection with pool counts
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
						{Object.entries(DEX_MAP).map(([dexId, dex]) => {
							const poolCount = allDexData[dexId]?.length || 0;
							return (
								<div
									key={dexId}
									onClick={() => setSelectedDex(dexId)}
									className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center p-6 border border-gray-100">
									<img
										src={dex.logo}
										alt={dex.name}
										className="w-12 h-12 mb-3 object-contain"
									/>
									<h2 className="text-lg font-bold text-gray-900">
										{dex.name}
									</h2>
									<p className="text-sm text-gray-500 mt-1">
										{poolCount} pool{poolCount !== 1 ? "s" : ""}
									</p>
								</div>
							);
						})}
					</div>
				) : (
					// Show pools for selected DEX
					<div>
						<button
							onClick={() => setSelectedDex(null)}
							className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
							⬅ Back to DEXes
						</button>

						{getSelectedPools().length === 0 ? (
							<div className="text-center text-gray-500 mt-10">
								No pools found for {getDexName(selectedDex)}
							</div>
						) : (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
									{getSelectedPools().map((pool) => (
										<div
											key={pool.id}
											className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col p-4">
											<div className="flex items-center mb-2">
												<img
													src={getDexLogo(pool.dex)}
													alt={pool.dex}
													className="w-6 h-6 mr-2 object-contain"
												/>
												<h2 className="text-lg font-bold text-gray-900 truncate">
													{pool.name}
												</h2>
											</div>

											<p className="text-sm text-gray-600 mb-1">
												DEX:{" "}
												<span className="font-medium">
													{getDexName(pool.dex)}
												</span>
											</p>
											<p className="text-sm text-gray-600 mb-1">
												Price (USD):{" "}
												<span className="font-medium">${pool.priceUsd}</span>
											</p>
											<p className="text-sm text-gray-600 mb-1">
												Liquidity:{" "}
												<span className="font-medium">
													${pool.liquidityUsd.toLocaleString()}
												</span>
											</p>
											{pool.volume24h > 0 && (
												<p className="text-sm text-gray-600 mb-1">
													24h Volume:{" "}
													<span className="font-medium">
														${pool.volume24h.toLocaleString()}
													</span>
												</p>
											)}
											{/* Show token amounts for Uniswap pools */}
											{pool.baseToken && pool.quoteToken && (
												<>
													<p className="text-sm text-gray-600 mb-1">
														Base Token:{" "}
														<span className="font-medium">
															{pool.baseToken}
														</span>
													</p>
													<p className="text-sm text-gray-600">
														Quote Token:{" "}
														<span className="font-medium">
															{pool.quoteToken}
														</span>
													</p>
												</>
											)}
										</div>
									))}
								</div>
								{/* tiny indicator to show background refresh */}
								<p className="text-xs text-gray-400 mt-4 text-right">
									Auto-refreshing every 30s
								</p>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default DecXPage;
