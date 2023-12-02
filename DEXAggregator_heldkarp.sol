// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDEX {
    function getQuote(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256 amountOut);
    function executeTrade(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256 amountOut);
}

contract DEXAggregator {
    IDEX[] public dexes;
    address public owner;
    uint constant MAX = 1e9;
    uint constant MAX_DEXES = 10; // Limit the number of DEXes for feasibility
    uint[1 << MAX_DEXES][MAX_DEXES] dp;

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

    // Implementation of TSP using Dynamic Programming (Held-Karp algorithm)
    function findOptimalPath(uint256[][] memory prices) public returns (uint256 minCost, uint256[] memory path) {
        uint n = prices.length;
        require(n <= MAX_DEXES, "Too many DEXes");

        // Initialize DP array
        for (uint i = 0; i < (1 << n); i++) {
            for (uint j = 0; j < n; j++) {
                dp[i][j] = MAX;
            }
        }
        dp[1][0] = 0; // Starting point

        // Compute the optimal path
        for (uint s = 1; s < (1 << n); s++) {
            for (uint i = 0; i < n; i++) {
                if (s & (1 << i) != 0) {
                    for (uint j = 0; j < n; j++) {
                        if (s & (1 << j) == 0) {
                            dp[s | (1 << j)][j] = min(dp[s | (1 << j)][j], dp[s][i] + prices[i][j]);
                        }
                    }
                }
            }
        }

        // Backtrack to find the path
        uint[] memory bestPath = new uint[](n);
        uint last = (1 << n) - 1;
        minCost = MAX;
        for (uint i = 1; i < n; i++) {
            if (dp[last][i] + prices[i][0] < minCost) {
                minCost = dp[last][i] + prices[i][0];
                bestPath[0] = i;
            }
        }
        for (uint i = 1, prev = bestPath[0]; i < n; i++) {
            for (uint j = 1; j < n; j++) {
                if ((last & (1 << j)) != 0 && dp[last][prev] == dp[last ^ (1 << prev)][j] + prices[j][prev]) {
                    bestPath[i] = j;
                    prev = j;
                    last ^= (1 << j);
                    break;
                }
            }
        }

        return (minCost, bestPath);
    }

    // Helper function for min calculation
    function min(uint a, uint b) private pure returns (uint) {
        return a < b ? a : b;
    }
}
