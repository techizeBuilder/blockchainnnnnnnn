import DexCard from "@/components/MainComponents/DexcCard";
import { useNetwork } from "@/lib/networkContext";
import { useEffect, useState } from "react";
import Request from "@/lib/apiCall";

const DecXPage = () => {
	const { selectedNetwork } = useNetwork();
	const [pools, setPools] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPools = async () => {
		if (!selectedNetwork?.name) return;

		// Only support Ethereum for now
		if (selectedNetwork.name.toLowerCase() !== "ethereum") {
			setPools([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await Request.get(`/prices/pools?chain=eth`);
			setPools(response.data.pools || []);
		} catch (error) {
			console.error("Error fetching pools:", error);
			setError("Failed to fetch pools. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Fetch once on mount and whenever network changes
	useEffect(() => {
		fetchPools();

		// Refresh every
		const interval = setInterval(() => {
			fetchPools();
		}, Number(import.meta.env.VITE_DEX_REFRESH_INTERVAL));

		return () => clearInterval(interval);
	}, [selectedNetwork]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full mb-4 animate-pulse">
						Decentralized Exchange Explorer
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Discover Liquidity Pools
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Explore live pool data from decentralized exchanges across supported
						blockchains.
					</p>
				</div>

				{selectedNetwork.name.toLowerCase() !== "ethereum" ? (
					<div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
						<p className="text-2xl font-semibold">
							🚀 {selectedNetwork.name} integration coming soon!
						</p>
					</div>
				) : loading ? (
					<div className="flex flex-col items-center justify-center h-[60vh]">
						<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
						<p className="text-lg text-gray-600">Loading Pools...</p>
					</div>
				) : error ? (
					<div className="text-center text-red-500 mt-10">{error}</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{pools.map((pool) => (
							<div
								key={pool.id}
								className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col p-4">
								<h2 className="text-lg font-bold text-gray-900 mb-2">
									{pool.name}
								</h2>
								<p className="text-sm text-gray-600 mb-1">
									DEX: <span className="font-medium">{pool.dex}</span>
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
				)}
			</div>
		</div>
	);
};

export default DecXPage;
