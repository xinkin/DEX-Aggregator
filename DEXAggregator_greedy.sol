// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDEX {
    function getQuote(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256 amountOut);
    function executeTrade(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256 amountOut);
}

contract DEXAggregator {
    IDEX[] public dexes;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    event TradeExecuted(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event DEXAdded(IDEX indexed dex);
    event DEXRemoved(IDEX indexed dex);

    constructor(IDEX[] memory _dexes) {
        require(_dexes.length > 0, "No DEXes provided");
        dexes = _dexes;
        owner = msg.sender;
    }

    function addDEX(IDEX dex) external onlyOwner {
        require(address(dex) != address(0), "Invalid DEX address");
        dexes.push(dex);
        emit DEXAdded(dex);
    }

    function removeDEX(uint256 index) external onlyOwner {
        require(index < dexes.length, "Index out of bounds");
        IDEX dex = dexes[index];
        dexes[index] = dexes[dexes.length - 1];
        dexes.pop();
        emit DEXRemoved(dex);
    }

    function getBestQuote(address tokenIn, address tokenOut, uint256 amountIn) public view returns (uint256 bestAmountOut, uint256 bestDexIndex) {
        require(dexes.length > 0, "No DEXes registered");
        bestAmountOut = 0;
        bestDexIndex = 0;
        for (uint i = 0; i < dexes.length; i++) {
            uint256 quote = dexes[i].getQuote(tokenIn, tokenOut, amountIn);
            if (quote > bestAmountOut) {
                bestAmountOut = quote;
                bestDexIndex = i;
            }
        }
    }

    function executeBestTrade(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) public returns (uint256 amountOut) {
        (uint256 bestAmountOut, uint256 bestDexIndex) = getBestQuote(tokenIn, tokenOut, amountIn);
        require(bestAmountOut >= minAmountOut, "Insufficient output amount");
        amountOut = dexes[bestDexIndex].executeTrade(tokenIn, tokenOut, amountIn, minAmountOut);
        emit TradeExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // Greedy Algorithm to select a trade path based on immediate best returns
    function executeGreedyTradePath(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) public returns (uint256 totalAmountOut) {
        uint256 remainingAmount = amountIn;
        totalAmountOut = 0;

        while (remainingAmount > 0) {
            (uint256 bestAmountOut, uint256 bestDexIndex) = getBestQuote(tokenIn, tokenOut, remainingAmount);
            if (bestAmountOut < minAmountOut) {
                break; // Break if no sufficient quotes are found
            }

            uint256 executedAmountOut = dexes[bestDexIndex].executeTrade(tokenIn, tokenOut, remainingAmount, minAmountOut);
            totalAmountOut += executedAmountOut;
            remainingAmount -= executedAmountOut;
            emit TradeExecuted(msg.sender, tokenIn, tokenOut, remainingAmount, executedAmountOut);
        }
    }
}
