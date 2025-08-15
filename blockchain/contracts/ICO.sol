// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

using SafeERC20 for IERC20;

contract ICO is Pausable, Ownable {
    IERC20 public token;
    uint256 public price = 0.0001 ether; // 0.0001 ETH per token
    uint256 public totalTokensSold;
    uint256 public totalRaised;
    
    // Events
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
    }

    function buyToken() external payable whenNotPaused {
        require(msg.value > 0, "Must send ETH to buy tokens");
        
        uint256 weiAmount = msg.value;
        uint256 numberOfTokens = (weiAmount * 10**18) / price; // Calculate tokens based on price
        
        require(numberOfTokens > 0, "Insufficient ETH for minimum token purchase");
        
        // Check if contract has enough tokens
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= numberOfTokens, "Insufficient tokens in contract");
        
        // Transfer tokens to buyer
        token.safeTransfer(msg.sender, numberOfTokens);
        
        // Update state
        totalTokensSold += numberOfTokens;
        totalRaised += weiAmount;
        
        emit TokensPurchased(msg.sender, numberOfTokens, weiAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(token.balanceOf(address(this)) >= amount, "Insufficient tokens");
        
        token.safeTransfer(owner(), amount);
        emit TokensWithdrawn(owner(), amount);
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
        emit FundsWithdrawn(owner(), balance);
    }

    function getTokenBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Emergency function to withdraw tokens if needed
    function emergencyWithdraw() external onlyOwner {
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance > 0) {
            token.safeTransfer(owner(), tokenBalance);
            emit TokensWithdrawn(owner(), tokenBalance);
        }
        
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            payable(owner()).transfer(ethBalance);
            emit FundsWithdrawn(owner(), ethBalance);
        }
    }
}