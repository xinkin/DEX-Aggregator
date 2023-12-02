// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract UniswapDEX {
    IUniswapV2Router02 public uniswapRouter;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    event TradeExecuted(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event RouterUpdated(address indexed oldRouter, address indexed newRouter);

    constructor(address _uniswapRouterAddress) {
        require(_uniswapRouterAddress != address(0), "Invalid router address");
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
        owner = msg.sender;
    }

    function updateRouter(address _newRouterAddress) external onlyOwner {
        require(_newRouterAddress != address(0), "Invalid router address");
        address oldRouter = address(uniswapRouter);
        uniswapRouter = IUniswapV2Router02(_newRouterAddress);
        emit RouterUpdated(oldRouter, _newRouterAddress);
    }

    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        address pairAddress = uniswapRouter.factory().getPair(tokenIn, tokenOut);
        require(pairAddress != address(0), "Pair not found");
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint256 reserveIn, uint256 reserveOut, ) = pair.getReserves();
        amountOut = uniswapRouter.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function executeTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256 amountOut) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 15 // deadline of 15 seconds from now
        );
        amountOut = amounts[1];
        emit TradeExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }
}
