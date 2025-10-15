// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IUniswapV2Router.sol";

/**
 * @title SwapAdapter
 * @notice Handles swaps across different DEX routers
 */
contract SwapAdapter {
    function swap(
        address dexRouter,
        address tokenIn,
        address tokenOut,
        uint amountIn
    ) external returns (uint amountOut) {
        IERC20(tokenIn).approve(dexRouter, amountIn);

        address[] memory path; // ✅ Declare path properly
        path[0] = tokenIn;
        path[1] = tokenOut;

        uint[] memory amounts = IUniswapV2Router(dexRouter).swapExactTokensForTokens(
            amountIn,
            0, // accept any output amount
            path,
            msg.sender, // send swapped tokens to caller
            block.timestamp
        );

        return amounts[1];
    }
}
