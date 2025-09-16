import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNetwork } from "@/lib/networkContext";

// Define a type for network objects
type Network = {
  name: string;
  icon: JSX.Element;
};

// Define the networks array
const networks: Network[] = [
  { name: "Ethereum", icon: <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg> },
  { name: "Polygon", icon: <svg className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M10.366 2L2 7.795v8.41L10.366 22l8.366-5.795v-8.41L10.366 2z" /></svg> },
  { name: "Avalanche", icon: <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12" /></svg> },
  { name: "Binance", icon: <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12" /></svg> },
  { name: "Solana", icon: <svg className="h-5 w-5 text-teal-400" viewBox="0 0 24 24" fill="currentColor"><path d="M3 16h18l-5 5H3v-5zm0-4h18l-5-5H3v5zm0-9h18l-5 5H3V3z" /></svg> },
  { name: "Fantom", icon: <svg className="h-5 w-5 text-blue-300" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12" /></svg> },
  { name: "Harmony", icon: <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2" /><rect x="14" y="4" width="4" height="16" rx="2" /><circle cx="12" cy="12" r="3" /></svg> },
  { name: "Tron", icon: <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3l20 9-10 9-10-9 10-9z" /></svg> },
];

export default function NetworkDropdown() {
  const { selectedNetwork, setSelectedNetwork } = useNetwork(); // Get global state
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Find the selected network object from the networks list
  const selectedNetworkObj = networks.find((n) => n.name === selectedNetwork.name) || networks[0];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-transparent border text-gray-800 hover:text-gray-900 transition-colors px-3  py-2 rounded-md"
      >
        <div className="flex items-center">
          <span className="h-5 w-5">{selectedNetworkObj.icon}</span>
          <span className="ml-2">{selectedNetworkObj.name}</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-gray-100 border rounded-md shadow-lg z-50">
          {networks.map((network, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedNetwork({ name: network.name }); // Update global state
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-200 transition"
            >
              <span className="h-5 w-5">{network.icon}</span>
              <span className="ml-2">{network.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
