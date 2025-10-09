// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRouter {
    // rate numerator/denominator to compute amountsOut: amountOut = amountIn * num / den
    uint256 public num;
    uint256 public den;

    constructor(uint256 _num, uint256 _den) {
        num = _num;
        den = _den;
    }

    function setRate(uint256 _num, uint256 _den) external {
        num = _num;
        den = _den;
    }

    // Mimic UniswapV2 getAmountsOut
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts) {
        amounts = new uint[](2);
        amounts[0] = amountIn;
        // compute output = amountIn * num / den
        amounts[1] = (amountIn * num) / den;
        return amounts;
    }

    // Mimic swapExactTokensForTokens:
    // It will transferFrom amountIn of path[0] from caller (the arbitrage contract) to this contract,
    // then mint/transfer the output token (path[last]) to `to`. Because our SimpleERC20 has a mint function,
    // ensure the router is the minter of output token in tests.
    function swapExactTokensForTokens(
        uint amountIn,
        uint /* amountOutMin */,
        address[] calldata path,
        address to,
        uint /* deadline */
    ) external returns (uint[] memory amounts) {
        // take input from caller
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);

        uint amountOut = (amountIn * num) / den;

        // If output token supports mint (SimpleERC20 in tests), mint to `to`.
        // Try low-level call to mint to support SimpleERC20; if it fails, try transfer
        // Note: tests will set router as minter for output token.
        (bool ok, ) = path[1].call(abi.encodeWithSignature("mint(address,uint256)", to, amountOut));
        if (!ok) {
            // fallback to transfer if no mint
            IERC20(path[1]).transfer(to, amountOut);
        }

        amounts = new uint[](2);
        amounts[0] = amountIn;
        amounts[1] = amountOut;
        return amounts;
    }
}
