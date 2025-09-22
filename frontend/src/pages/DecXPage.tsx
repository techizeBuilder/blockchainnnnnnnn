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
}

const DecXPage = () => {
	const { selectedNetwork } = useNetwork();
	const [pools, setPools] = useState<Pool[]>([]);
	const [selectedDex, setSelectedDex] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// keep track if it's the first load
	const firstLoad = useRef(true);

	// Fetch pools for selected DEX
	const fetchPools = async (dexId: string) => {
		if (firstLoad.current) setLoading(true);
		setError(null);

		try {
			const response = await Request.get(`/prices/ethereum`);
			const filteredPools = (response.data || []).filter(
				(pool: Pool) => pool.dex.toLowerCase() === dexId.toLowerCase()
			);
			setPools(filteredPools);
		} catch (err) {
			console.error("Error fetching pools:", err);
			setError("Failed to fetch pools.");
		} finally {
			setLoading(false);
			firstLoad.current = false; // after first fetch, don't block UI anymore
		}
	};

	const getDexLogo = (dexId: string) => {
		return DEX_MAP[dexId]?.logo || "https://via.placeholder.com/40?text=DEX";
	};

	const getDexName = (dexId: string) => {
		return DEX_MAP[dexId]?.name || dexId;
	};

	// initial + auto refresh
	useEffect(() => {
		if (selectedDex) {
			fetchPools(selectedDex);

			// set up interval to refresh every 30s
			const interval = setInterval(() => {
				fetchPools(selectedDex);
			}, Number(import.meta.env.VITE_DEX_REFRESH_INTERVAL));

			return () => clearInterval(interval);
		}
	}, [selectedDex]);

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
				) : !selectedDex ? (
					// Show DEX selection
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
						{Object.entries(DEX_MAP).map(([dexId, dex]) => (
							<div
								key={dexId}
								onClick={() => {
									firstLoad.current = true; // reset loading state for new DEX
									setSelectedDex(dexId);
								}}
								className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center p-6 border border-gray-100">
								<img
									src={dex.logo}
									alt={dex.name}
									className="w-12 h-12 mb-3 object-contain"
								/>
								<h2 className="text-lg font-bold text-gray-900">{dex.name}</h2>
							</div>
						))}
					</div>
				) : loading && pools.length === 0 ? (
					// Show loading state only when no pools loaded yet
					<div className="flex flex-col items-center justify-center h-[60vh]">
						<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
						<p className="text-lg text-gray-600">Loading Pools...</p>
					</div>
				) : (
					// Show pools (even while background fetching)
					<div>
						<button
							onClick={() => setSelectedDex(null)}
							className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
							⬅ Back to DEXes
						</button>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
							{pools.map((pool) => (
								<div
									key={pool.id}
									className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col p-4">
									<div className="flex items-center mb-2">
										<img
											src={getDexLogo(pool.dex)}
											alt={pool.dex}
											className="w-6 h-6 mr-2 object-contain"
										/>
										<h2 className="text-lg font-bold text-gray-900">
											{pool.name}
										</h2>
									</div>

									<p className="text-sm text-gray-600 mb-1">
										DEX:{" "}
										<span className="font-medium">{getDexName(pool.dex)}</span>
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
									<p className="text-sm text-gray-600">
										24h Volume:{" "}
										<span className="font-medium">
											${pool.volume24h.toLocaleString()}
										</span>
									</p>
								</div>
							))}
						</div>
						{/* tiny indicator to show background refresh */}
						<p className="text-xs text-gray-400 mt-4 text-right">
							Auto-refreshing every 30s
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DecXPage;
