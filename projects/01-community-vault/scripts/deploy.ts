import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const deadline = BigInt(currentTimestampInSeconds + 24 * 60 * 60);
  const goal = parseEther("2");

  const vault = await hre.viem.deployContract("CommunityVault", [goal, deadline]);

  console.log(
    `CommunityVault with goal ${formatEther(
      goal
    )} ETH and deadline ${deadline} deployed to ${vault.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
