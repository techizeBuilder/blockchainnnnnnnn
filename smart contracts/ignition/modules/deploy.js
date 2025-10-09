const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Aave v3 PoolAddressesProvider (mainnet example)
  const AAVE_PROVIDER = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
  const INITIAL_FEE_BPS = 30; // 0.3%

  const Arbitrage = await ethers.getContractFactory("ProdMultiDexArbitrage");
  const contract = await Arbitrage.deploy(AAVE_PROVIDER, INITIAL_FEE_BPS);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Deployed at:", address);

  console.log("⏳ Verifying on Etherscan...");
  await contract.deploymentTransaction().wait(5);

  await hre.run("verify:verify", {
    address,
    constructorArguments: [AAVE_PROVIDER, INITIAL_FEE_BPS],
  });

  console.log("🎯 Verification complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
