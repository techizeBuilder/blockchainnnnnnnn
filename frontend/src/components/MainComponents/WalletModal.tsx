import React from "react";
import { X } from "lucide-react";

interface Wallet {
  name: string;
  logo: string;
}

const wallets: Wallet[] = [
  {
    name: "WalletConnect",
    logo: "https://www.nuget.org/profiles/WalletConnect/avatar?imageSize=512",
  },
  {
    name: "Coinbase Wallet",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF6hcTTU1A8Ymi2VldXqCsPkBu_ltAhIKiRg&s",
  },
  {
    name: "Fortmatic",
    logo: "https://pbs.twimg.com/profile_images/1293288961800933376/rtDOqMXY_400x400.jpg",
  },
  {
    name: "Portis",
    logo: "https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs2/173394315/original/9ef9a6e2423941ce649e43cc8769ae5657468bfc.png",
  },
  {
    name: "Torus",
    logo: "https://pbs.twimg.com/profile_images/1481216085387280389/HlfpkhxR_400x400.png",
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1E1E2E] p-6 shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">
            Available Wallets ({wallets.length})
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {wallets.map((wallet, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center bg-[#2A2A3C] text-white px-4 py-4 rounded-xl shadow-lg hover:bg-[#3A3A4C] transition transform hover:scale-105"
            >
              <div className="flex items-center gap-6 justify-center w-1/2 p-2 bg-gray-800 rounded-full shadow-md">
                <img src={wallet.logo} alt={wallet.name} className="w-8 h-8" />
                <span className="text-sm font-medium">{wallet.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-4 bg-gray-800 px-4 py-2 rounded-md text-gray-400 text-sm flex justify-between items-center">
          <span>Why don’t I see my wallet?</span>
          <a href="#" className="text-blue-400 hover:underline">
            Click here to learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
