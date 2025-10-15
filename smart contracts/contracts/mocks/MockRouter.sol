// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        require(path.length == 2, "only 2-token swap");
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);

        // Return same amount + 1% profit
        uint amountOut = (amountIn * 101) / 100;
        IERC20(path[1]).transfer(to, amountOut);

        amounts = new uint[](2) ;
        amounts[0] = amountIn;
        amounts[1] = amountOut;
    }
}
