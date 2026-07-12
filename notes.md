

## Cheat Sheet

npx hardhat compile -> Compile contract

npx hardhat node -> Start node in local network

npx hardhat ignition deploy ./ignition/modules/SimpleStorage.ts --network localhost -> Deploy in local network

npx hardhat test -> Runs all tests

npx hardhat
    -> Create a TypeScript project (with Viem)
    -> Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox-viem)? -> y


# Structures and data types and keywords

**address** : Path of the user account or contract
**playable** : Sets that the user address can receive ETH directly.

**msg.sender** : Address of the account performing an action with the contract.



# Useful lines of code

const [owner, otherAccount] = await hre.viem.getWalletClients();  // Gets two account addresses (useful to simulate two or more actors)




