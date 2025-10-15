// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArbitrageManager
 * @notice Stores and manages user arbitrage strategies
 */
contract ArbitrageManager is Ownable(msg.sender) {
    struct Strategy {
        address dexA;
        address dexB;
        address tokenIn;
        address tokenOut;
        uint256 amount;
    }

    mapping(address => Strategy[]) public userStrategies;

    event StrategyCreated(address indexed user, uint indexed id);
    event StrategyUpdated(address indexed user, uint indexed id);
    event StrategyDeleted(address indexed user, uint indexed id);

    function createStrategy(
        address dexA,
        address dexB,
        address tokenIn,
        address tokenOut,
        uint256 amount
    ) external {
        userStrategies[msg.sender].push(Strategy(dexA, dexB, tokenIn, tokenOut, amount));
        emit StrategyCreated(msg.sender, userStrategies[msg.sender].length - 1);
    }

    function getStrategies(address user) external view returns (Strategy[] memory) {
        return userStrategies[user];
    }

    function updateStrategy(
        uint id,
        address dexA,
        address dexB,
        address tokenIn,
        address tokenOut,
        uint256 amount
    ) external {
        require(id < userStrategies[msg.sender].length, "Invalid ID");
        Strategy storage s = userStrategies[msg.sender][id];
        s.dexA = dexA;
        s.dexB = dexB;
        s.tokenIn = tokenIn;
        s.tokenOut = tokenOut;
        s.amount = amount;
        emit StrategyUpdated(msg.sender, id);
    }

    function deleteStrategy(uint id) external {
        require(id < userStrategies[msg.sender].length, "Invalid ID");
        delete userStrategies[msg.sender][id];
        emit StrategyDeleted(msg.sender, id);
    }
}
