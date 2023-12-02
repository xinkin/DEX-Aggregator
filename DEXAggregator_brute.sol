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

    // Brute-force implementation of TSP to find the optimal path through DEXes
    function findOptimalPath(uint256[][] memory prices) public pure returns (uint256 minCost, uint256[] memory path) {
        uint256 n = prices.length;
        require(n > 0, "No prices provided");
        require(prices[0].length == n, "Prices matrix must be square");

        minCost = type(uint256).max;
        path = new uint256[](n);
        uint256[] memory currentPath = new uint256[](n);

        // Generating all permutations of paths
        permute(prices, currentPath, 0, n, minCost, path);
        return (minCost, path);
    }

    // Helper function to generate permutations and calculate cost
    function permute(uint256[][] memory prices, uint256[] memory currentPath, uint256 l, uint256 r, uint256 storage minCost, uint256[] storage bestPath) internal pure {
        if (l == r) {
            uint256 currentCost = calculateCost(prices, currentPath);
            if (currentCost < minCost) {
                minCost = currentCost;
                for (uint256 i = 0; i < r; i++) {
                    bestPath[i] = currentPath[i];
                }
            }
        } else {
            for (uint256 i = l; i < r; i++) {
                (currentPath[l], currentPath[i]) = (currentPath[i], currentPath[l]);
                permute(prices, currentPath, l + 1, r, minCost, bestPath);
                (currentPath[l], currentPath[i]) = (currentPath[i], currentPath[l]); // backtrack
            }
        }
    }

    // Calculate the total cost of a given path
    function calculateCost(uint256[][] memory prices, uint256[] memory path) internal pure returns (uint256 totalCost) {
        totalCost = 0;
        for (uint256 i = 0; i < path.length - 1; i++) {
            totalCost += prices[path[i]][path[i + 1]];
        }
        totalCost += prices[path[path.length - 1]][path[0]]; // Returning to the start
        return totalCost;
    }
}
