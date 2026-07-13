# 01 - Community Vault

Mini crowdfunding contract using Solidity + Hardhat that:

- Accepts ETH contributions before a deadline.
- Mints ERC-20 receipt tokens to contributors (1 wei = 1 token unit).
- Lets owner withdraw funds once funding goal is met.
- Lets contributors claim refunds if the deadline passes and goal is not met.

## Project Structure

- Contract: `contracts/Lock.sol` (contains `CommunityVault`)
- Tests: `test/Lock.ts`
- Deploy script: `scripts/deploy.ts`

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Compile

```bash
npx hardhat compile
```

## Test

```bash
npx hardhat test
```

## Local Deployment

1. Start a local node:

```bash
npx hardhat node
```

2. Deploy in another terminal:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

## CommunityVault Behavior

- Constructor params:
	- `goal` in wei
	- `deadline` as unix timestamp
- `contribute()`:
	- Payable
	- Only before deadline
	- Tracks contribution per address
	- Mints ERC-20 receipt tokens
- `withdraw()`:
	- Only owner
	- Only when goal is met
	- Uses checks-effects-interactions + nonReentrant
- `refund()`:
	- Only after deadline
	- Only when goal was not met
	- Contributor can claim once
	- Uses pull pattern and nonReentrant

## Events

- `ContributionReceived(address indexed contributor, uint256 amount)`
- `FundsWithdrawn(address indexed owner, uint256 amount)`
- `RefundClaimed(address indexed contributor, uint256 amount)`

## Test Coverage Included

- Contributing ETH and receiving tokens
- Owner withdrawing after goal is met
- Contributor claiming refund after deadline when goal is not met
- Revert when contributing after deadline
- Revert when owner withdraws before goal is met
- Event emission for contribution, withdrawal, and refund
