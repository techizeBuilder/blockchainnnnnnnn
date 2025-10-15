// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./core/FlashLoanExecutor.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProdMultiDexArbitrage
 * @notice Orchestrates flash loan arbitrage using FlashLoanExecutor and SwapAdapter
 */
contract ProdMultiDexArbitrage is Ownable(msg.sender) {
    FlashLoanExecutor public executor;

    constructor(address _executor) {
        executor = FlashLoanExecutor(_executor);
    }

    function executeStrategy(
        address asset,     // e.g., WETH or USDC
        uint256 amount,    
        address dexA,
        address dexB,
        address tokenIn,
        address tokenOut
    ) external onlyOwner {
        executor.executeArbitrage(asset, amount, dexA, dexB, tokenIn, tokenOut);
    }
}
