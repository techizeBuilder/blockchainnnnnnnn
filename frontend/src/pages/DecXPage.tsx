import DexCard from '@/components/MainComponents/DexcCard';
import { useNetwork } from '@/lib/networkContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiTrendingUp, FiLink } from 'react-icons/fi';

const DecXPage = () => {
    const { selectedNetwork } = useNetwork();
    const [dexes, setDexes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    console.log("Network in DEX page:", selectedNetwork);
    // console.log("Base URL:", baseUrl);

    const fetchNetworksDexes = async () => {
        if (!selectedNetwork?.name) return;

        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(`${baseUrl}/dex/${selectedNetwork.name}`);
            console.log("Networks DEX response:", res);

            setDexes(res.data.dexes || []);
        } catch (error) {
            console.log("Error fetching DEXs:", error);
            setError("Failed to fetch DEXs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNetworksDexes();
    }, [selectedNetwork]);

    return (
        <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full mb-4 animate-pulse">
                        Decentralized Exchange Explorer
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Discover DEX Platforms
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore decentralized exchanges across multiple blockchains and find the best platforms for your trading needs.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg text-gray-600">Discovering DEX platforms...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {dexes.map((dex) => (
                            <div
                                key={dex.id}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                <DexCard
                                    key={dex.id}
                                    id={dex.id}
                                    name={dex.name}
                                    logo={dex.logo}
                                    chains={dex.chains}
                                    tvl={dex.tvl}
                                    url={dex.url}
                                />

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DecXPage;
