// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library TokenUtils {
    function approveMax(address token, address spender) internal {
        IERC20(token).approve(spender, type(uint256).max);
    }

    function balanceOf(address token, address user) internal view returns (uint256) {
        return IERC20(token).balanceOf(user);
    }
}
