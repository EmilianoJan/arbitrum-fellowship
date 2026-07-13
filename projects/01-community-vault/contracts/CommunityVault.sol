// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CommunityVault is ERC20, Ownable, ReentrancyGuard {
    uint256 public immutable goal;
    uint256 public immutable deadline;
    uint256 public totalContributed;
    bool public withdrawn;

    mapping(address => uint256) public contributions;

    event ContributionReceived(address indexed contributor, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event RefundClaimed(address indexed contributor, uint256 amount);

    constructor(uint256 _goal, uint256 _deadline)
        ERC20("Community Vault Receipt", "CVR")
        Ownable(msg.sender)
    {
        require(_goal > 0, "Goal must be greater than zero");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        goal = _goal;
        deadline = _deadline;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;

        _mint(msg.sender, msg.value);
        emit ContributionReceived(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner nonReentrant {
        require(totalContributed >= goal, "Funding goal not met");
        require(!withdrawn, "Funds already withdrawn");

        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");

        withdrawn = true;

        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Transfer failed");

        emit FundsWithdrawn(owner(), amount);
    }

    function refund() external nonReentrant {
        require(block.timestamp > deadline, "Funding still active");
        require(totalContributed < goal, "Funding goal met");

        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contribution to refund");

        contributions[msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Refund transfer failed");

        emit RefundClaimed(msg.sender, amount);
    }
}
