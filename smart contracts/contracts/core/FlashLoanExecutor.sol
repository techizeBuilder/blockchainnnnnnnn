// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IAavePool.sol";
import "./SwapAdapter.sol";

/**
 * @title FlashLoanExecutor
 * @notice Executes multi-DEX flash loan arbitrage using Aave
 */
contract FlashLoanExecutor is Ownable(msg.sender) {
    IAavePool public aavePool;
    SwapAdapter public swapAdapter;

    event ArbitrageExecuted(address indexed asset, uint profit, uint timestamp);

    constructor(address _aavePool, address _swapAdapter) {
        aavePool = IAavePool(_aavePool);
        swapAdapter = SwapAdapter(_swapAdapter);
    }

    /**
     * @notice Initiates a flash loan from Aave
     */
    function executeFlashLoan(
        address asset,
        uint256 amount,
        bytes calldata params
    ) external onlyOwner {
        aavePool.flashLoanSimple(address(this), asset, amount, params, 0);
    }

    /**
     * @notice Aave callback function
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        (address dexA, address dexB, address tokenIn, address tokenOut) =
            abi.decode(params, (address, address, address, address));

        // Perform multi-DEX arbitrage
        uint amountOut = swapAdapter.swap(dexA, tokenIn, tokenOut, amount);
        uint finalOut = swapAdapter.swap(dexB, tokenOut, tokenIn, amountOut);

        require(finalOut > amount + premium, "Not profitable");

        // Repay Aave loan
        IERC20(asset).approve(address(aavePool), amount + premium);

        // Send profit to owner
        uint profit = finalOut - (amount + premium);
        IERC20(asset).transfer(owner(), profit);

        emit ArbitrageExecuted(asset, profit, block.timestamp);

        return true;
    }

     /**
     * @notice High-level function to start an arbitrage trade
     * @dev This wraps the flash loan call for external orchestrator contracts
     */
    function executeArbitrage(
        address asset,
        uint256 amount,
        address dexA,
        address dexB,
        address tokenIn,
        address tokenOut
    ) external onlyOwner {
        // Encode parameters for executeOperation()
        bytes memory params = abi.encode(dexA, dexB, tokenIn, tokenOut);

        // Trigger flash loan
        aavePool.flashLoanSimple(address(this), asset, amount, params, 0);
    }
}
