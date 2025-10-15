// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // --- STEP 1: Deploy SwapAdapter ---
  console.log("📦 Deploying SwapAdapter...");
  const SwapAdapter = await ethers.getContractFactory("SwapAdapter");
  const swapAdapter = await SwapAdapter.deploy();
  await swapAdapter.waitForDeployment();
  console.log(`✅ SwapAdapter deployed at: ${swapAdapter.target}`);

  // --- STEP 2: Deploy MockAavePool (for testing) ---
  console.log("📦 Deploying MockAavePool...");
  const MockAavePool = await ethers.getContractFactory("MockAavePool");
  const mockAavePool = await MockAavePool.deploy();
  await mockAavePool.waitForDeployment();
  console.log(`✅ MockAavePool deployed at: ${mockAavePool.target}`);

  // --- STEP 3: Deploy FlashLoanExecutor ---
  console.log("📦 Deploying FlashLoanExecutor...");
  const FlashLoanExecutor = await ethers.getContractFactory("FlashLoanExecutor");
  const executor = await FlashLoanExecutor.deploy(mockAavePool.target, swapAdapter.target);
  await executor.waitForDeployment();
  console.log(`✅ FlashLoanExecutor deployed at: ${executor.target}`);

  // --- STEP 4: Deploy ProdMultiDexArbitrage ---
  console.log("📦 Deploying ProdMultiDexArbitrage...");
  const ProdMultiDexArbitrage = await ethers.getContractFactory("ProdMultiDexArbitrage");
  const arbitrage = await ProdMultiDexArbitrage.deploy(executor.target);
  await arbitrage.waitForDeployment();
  console.log(`✅ ProdMultiDexArbitrage deployed at: ${arbitrage.target}`);

  console.log("\n🎯 All contracts deployed successfully!");
  console.log("-------------------------------------------");
  console.log(`SwapAdapter:             ${swapAdapter.target}`);
  console.log(`MockAavePool:            ${mockAavePool.target}`);
  console.log(`FlashLoanExecutor:       ${executor.target}`);
  console.log(`ProdMultiDexArbitrage:   ${arbitrage.target}`);
  console.log("-------------------------------------------");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
