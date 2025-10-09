// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockPool {
    // premium in token units
    uint256 public premium;

    constructor(uint256 _premium) {
        premium = _premium;
    }

    // Basic flashLoanSimple mimic: transfer asset to receiver, call executeOperation
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 /* referralCode */
    ) external {
        // transfer asset to receiver (assumes this contract has minted/has tokens)
        // We assume this pool is the minter for test tokens
        // use low-level mint call (SimpleERC20)
        (bool ok, ) = asset.call(abi.encodeWithSignature("mint(address,uint256)", receiverAddress, amount));
        require(ok, "mint fail");

        // call executeOperation on receiver
        bool success = IFlashLoanSimpleReceiver(receiverAddress).executeOperation(
            asset,
            amount,
            premium,
            address(this),
            params
        );
        require(success, "executeOperation failed");

        // after executeOperation, expect repayment: simply attempt to transfer amount+premium to this contract
        uint256 expected = amount + premium;
        IERC20(asset).transferFrom(receiverAddress, address(this), expected);
        // pool keeps funds; nothing else required
    }

    // helper to set premium
    function setPremium(uint256 _p) external {
        premium = _p;
    }
}
