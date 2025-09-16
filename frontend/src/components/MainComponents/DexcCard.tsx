import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, Network, DollarSign } from 'lucide-react';

interface DexCardProps {
    id: string;
    name: string;
    logo: string;
    chains: string[];
    tvl: number;
    url: string;
}

const DexCard: React.FC<DexCardProps> = ({ id, name, logo, chains, tvl, url }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
        glass-card rounded-2xl p-6 overflow-hidden relative transition-all duration-300
        animate-scale-in hover:shadow-xl hover:translate-y-[-4px] subtle-shadow
        ${isHovered ? 'ring-2 ring-primary/20 scale-[1.02]' : ''}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start mb-4">
                <div className="relative mr-4 flex-shrink-0">
                    {!imageLoaded && (
                        <div className="w-16 h-16 rounded-xl skeleton" />
                    )}
                    <img
                        src={logo}
                        alt={name}
                        className={`w-16 h-16 rounded-xl object-cover transition-opacity duration-300 shadow-sm ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {isHovered && (
                        <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center animate-fade-in">
                            <ArrowUpRight className="w-6 h-6 text-primary" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold">{name}</h3>
                    </div>
                    <div className="mt-1 flex items-center">
                        <Network className="w-4 h-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-600 line-clamp-1">{chains.join(", ")}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full justify-between items-center mt-4">
                <div className="flex items-center">
                    <div className="bg-emerald-50 rounded-full p-1.5 mr-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="font-medium text-gray-800">
                        ${tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                </div>

                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-button group w-full gap-2 text-blue-700 flex items-center justify-center mt-3"
                    aria-label={`Visit ${name}`}

                >
                    Visit
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
            </div>
        </div>
    );
};

export default DexCard;