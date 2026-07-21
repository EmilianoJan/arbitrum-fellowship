# Definitions

**wei**: Minimal unit of ETH (1 wei = 10^(-18) ETH)

**RPC**: Remote Procedure Call. Protocol in which an application communicates with a blockchain node. 

**EOA**: Externally owned account

# Cheat Sheet

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

**_mint(msg.sender, msg.value)** : Aumenta el balance de la cuenta destino

# Useful lines of code

const [owner, otherAccount] = await hre.viem.getWalletClients();  // Gets two account addresses (useful to simulate two or more actors)


require (*condition*, *msg*) ; // The condition must be meet, if not the execution is cancel. If the condition is 'False', breaks the execution of the contract.  All the gas before the *require* is computed. 


Para transferir un monto a un usuario:
(bool sent, ) = payable(owner()).call{value: amount}("");
require(sent, "Transfer failed"); // If the transfer failed, all changes in the function are reverted. (For example if the contract has a *withdrawn* flag, that was previously change to 'True', if any *require* statement is false, withdrawn will change to 'False' (the original state) ).




