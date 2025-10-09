// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20 is ERC20 {
    address public minter;

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        minter = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only minter");
        _mint(to, amount);
    }

    function setMinter(address newMinter) external {
        require(msg.sender == minter, "Only minter");
        minter = newMinter;
    }
}
