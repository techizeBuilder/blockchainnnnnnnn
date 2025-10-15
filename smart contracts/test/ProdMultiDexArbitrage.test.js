const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("⚡ ProdMultiDexArbitrage (local mock test)", function () {
  let tokenA, tokenB, router1, router2, swapAdapter, executor, arbitrage, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    tokenA = await MockERC20.deploy("TokenA", "TKA");
    tokenB = await MockERC20.deploy("TokenB", "TKB");

    const MockRouter = await ethers.getContractFactory("MockRouter");
    router1 = await MockRouter.deploy();
    router2 = await MockRouter.deploy();

    const SwapAdapter = await ethers.getContractFactory("SwapAdapter");
    swapAdapter = await SwapAdapter.deploy();

    const FlashLoanExecutor = await ethers.getContractFactory("FlashLoanExecutor");
    executor = await FlashLoanExecutor.deploy(swapAdapter.target);

    const ProdMultiDexArbitrage = await ethers.getContractFactory("ProdMultiDexArbitrage");
    arbitrage = await ProdMultiDexArbitrage.deploy(executor.target);

    // Mint tokens to owner
    await tokenA.mint(owner.address, ethers.parseEther("100"));
    await tokenA.approve(arbitrage.target, ethers.parseEther("100"));
  });

  it("executes profitable arbitrage across two mock routers", async function () {
    const routers = [router1.target, router2.target];
    const path = [tokenA.target, tokenB.target, tokenA.target];
    const amountIn = ethers.parseEther("10");

    await expect(arbitrage.startArbitrage(routers, path, amountIn)).to.not.be.reverted;
  });
});
