// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Production-grade Multi-DEX Flash Loan Arbitrage Contract
 * - Supports multiple swap legs (multi-hop, multi-DEX)
 * - Compatible with Aave v3 flash loans
 * - Uses OpenZeppelin security modules
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";

/// @notice Simplified Uniswap-V2-like router interface
interface IDexRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(uint amountIn, address[] calldata path)
        external
        view
        returns (uint[] memory amounts);
}

contract ProdMultiDexArbitrage is FlashLoanSimpleReceiverBase, Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Constants
    uint256 public constant MAX_SLIPPAGE_BPS = 500; // Max 5%
    uint256 public constant BPS_DIVISOR = 10000;

    // Configuration
    uint256 public minProfit; // Minimum profit (in flash asset units)
    uint256 public slippageToleranceBps; // e.g., 100 = 1%

    // Structs
    struct SwapLeg {
        address router;
        address[] path;
    }

    struct ArbitrageOpportunity {
        address flashAsset;
        uint256 amount;
        SwapLeg[] legs;
    }

    // Events
    event ArbitrageExecuted(address indexed asset, uint256 borrowed, uint256 profit);
    event FundsWithdrawn(address indexed token, uint256 amount);
    event ParametersUpdated(uint256 minProfit, uint256 slippageToleranceBps);

    // Constructor
    constructor(
        address _addressesProvider,
        uint256 _minProfit,
        uint256 _slippageToleranceBps
    )
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressesProvider))
        Ownable(msg.sender)
    {
        require(_addressesProvider != address(0), "Invalid provider");
        require(_slippageToleranceBps <= MAX_SLIPPAGE_BPS, "Slippage too high");
        minProfit = _minProfit;
        slippageToleranceBps = _slippageToleranceBps;
    }

    // --- Owner functions ---

    function setParameters(uint256 _minProfit, uint256 _slippageToleranceBps) external onlyOwner {
        require(_slippageToleranceBps <= MAX_SLIPPAGE_BPS, "Slippage too high");
        minProfit = _minProfit;
        slippageToleranceBps = _slippageToleranceBps;
        emit ParametersUpdated(_minProfit, _slippageToleranceBps);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance");
        IERC20(token).safeTransfer(owner(), balance);
        emit FundsWithdrawn(token, balance);
    }

    // --- Arbitrage Execution ---

    function executeArbitrage(ArbitrageOpportunity calldata opp)
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(opp.legs.length > 0, "Empty path");
        bytes memory data = abi.encode(opp);
        POOL.flashLoanSimple(address(this), opp.flashAsset, opp.amount, data, 0);
    }

    /**
     * @dev Flash loan callback (Aave v3)
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Unauthorized");
        require(initiator == address(this), "Invalid initiator");

        ArbitrageOpportunity memory opp = abi.decode(params, (ArbitrageOpportunity));
        uint256 currentAmount = amount;
        address currentToken = asset;

        // Perform each swap leg
        for (uint256 i = 0; i < opp.legs.length; i++) {
            SwapLeg memory leg = opp.legs[i];
            require(leg.path.length >= 2, "Invalid path");
            require(leg.path[0] == currentToken, "Path mismatch");

            // Approve router
            IERC20(currentToken).safeIncreaseAllowance(leg.router, currentAmount);

            // Get expected output
            uint[] memory amounts = IDexRouter(leg.router).getAmountsOut(currentAmount, leg.path);
            uint expectedOut = amounts[amounts.length - 1];
            uint amountOutMin = (expectedOut * (BPS_DIVISOR - slippageToleranceBps)) / BPS_DIVISOR;

            // Swap
            uint[] memory outAmounts = IDexRouter(leg.router).swapExactTokensForTokens(
                currentAmount,
                amountOutMin,
                leg.path,
                address(this),
                block.timestamp
            );

            currentAmount = outAmounts[outAmounts.length - 1];
            currentToken = leg.path[leg.path.length - 1];
        }

        // Ensure we end with flashAsset
        require(currentToken == asset, "Final asset mismatch");

        uint256 totalDebt = amount + premium;
        uint256 finalBalance = IERC20(asset).balanceOf(address(this));
        require(finalBalance >= totalDebt + minProfit, "Not profitable");

        uint256 profit = finalBalance - totalDebt;

        // Repay Aave
        IERC20(asset).approve(address(POOL), totalDebt);

        emit ArbitrageExecuted(asset, amount, profit);
        return true;
    }

    // --- Emergency Rescue ---

    function rescueTokens(address token, address to) external onlyOwner {
        uint bal = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(to, bal);
    }
}
