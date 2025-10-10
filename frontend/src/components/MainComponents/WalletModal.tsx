import React from "react";
import { X } from "lucide-react";
import { ethers } from "ethers";

interface WalletModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConnect: (walletName: string, address?: string) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
	isOpen,
	onClose,
	onConnect,
}) => {
	if (!isOpen) return null;

	const connectMetaMask = async (): Promise<void> => {
		try {
			// Check specifically for MetaMask
			if (window.ethereum && window.ethereum.isMetaMask) {
				// Request account access
				await window.ethereum.request({ method: "eth_requestAccounts" });

				// Create ethers provider
				const provider = new ethers.BrowserProvider(window.ethereum);

				// Get signer and address
				const signer = await provider.getSigner();
				const address = await signer.getAddress();

				onConnect("MetaMask", address);
				onClose();
			} else {
				alert(
					"MetaMask is not installed! Please install it from https://metamask.io/"
				);
			}
		} catch (error) {
			console.error("Error connecting to MetaMask:", error);
			alert("Failed to connect to MetaMask");
		}
	};

	const wallets = [
		{
			name: "MetaMask",
			logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
			connector: connectMetaMask,
		},
	];

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-[#1E1E2E] p-6 shadow-lg rounded-xl w-96 max-w-full mx-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-white text-lg font-semibold">Connect Wallet</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-white">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Wallet Options */}
				<div className="space-y-3">
					{wallets.map((wallet, index) => (
						<button
							key={index}
							onClick={wallet.connector}
							className="flex items-center justify-between bg-[#2A2A3C] text-white px-4 py-3 rounded-xl shadow-lg hover:bg-[#3A3A4C] transition transform hover:scale-105 w-full">
							<div className="flex items-center gap-3">
								<img
									src={wallet.logo}
									alt={wallet.name}
									className="w-8 h-8 rounded-full"
								/>
								<span className="text-sm font-medium">{wallet.name}</span>
							</div>
							<div className="text-xs text-gray-400">Connect</div>
						</button>
					))}
				</div>

				{/* Footer Section */}
				<div className="mt-4 bg-gray-800 px-4 py-3 rounded-md text-gray-400 text-sm">
					<div className="flex justify-between items-center">
						<span>Need MetaMask?</span>
						<a
							href="https://metamask.io/download/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:underline">
							Download here
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WalletModal;
