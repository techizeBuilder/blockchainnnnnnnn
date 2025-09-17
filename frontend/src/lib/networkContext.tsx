import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// Define network type
type Network = {
  name: string;
};

// Define context type
interface NetworkContextType {
  selectedNetwork: Network;
  setSelectedNetwork: (network: Network) => void;
}

// Create context
const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Provider component
export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>({ name: "Ethereum" });

  // Load selected network from localStorage on mount
  useEffect(() => {
    const storedNetwork = localStorage.getItem("selectedNetwork");
    if (storedNetwork) {
      setSelectedNetwork(JSON.parse(storedNetwork));
    }
  }, []);

  // Save selected network to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedNetwork", JSON.stringify(selectedNetwork));
  }, [selectedNetwork]);

  return (
    <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

// Hook to use the context
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
