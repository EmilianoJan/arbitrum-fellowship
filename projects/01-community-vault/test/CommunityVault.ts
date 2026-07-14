import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseEther } from "viem";

describe("CommunityVault", function () {
  async function expectRevertWith(
    txPromise: Promise<unknown>,
    expectedMessage: string
  ) {
    try {
      await txPromise;
      expect.fail("Expected transaction to revert");
    } catch (error) {
      expect(String(error)).to.contain(expectedMessage);
    }
  }

  async function deployVaultFixture() {
    const ONE_DAY_IN_SECS = 24 * 60 * 60;
    const goal = parseEther("2");
    const deadline = BigInt((await time.latest()) + ONE_DAY_IN_SECS);

    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const vault = await hre.viem.deployContract("CommunityVault", [
      goal,
      deadline,
    ]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      vault,
      goal,
      deadline,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right goal and deadline", async function () {
      const { vault, goal, deadline } = await loadFixture(deployVaultFixture);

      expect(await vault.read.goal()).to.equal(goal);
      expect(await vault.read.deadline()).to.equal(deadline);
    });

    it("Should set the right owner", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);

      expect(await vault.read.owner()).to.equal(getAddress(owner.account.address));
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions, track amounts, and mint receipt tokens", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);
      const amount = parseEther("1");

      await vault.write.contribute([], { value: amount });

      expect(await vault.read.contributions([owner.account.address])).to.equal(
        amount
      );
      expect(await vault.read.balanceOf([owner.account.address])).to.equal(
        amount
      );
      expect(await vault.read.totalContributed()).to.equal(amount);
    });

    it("Should emit ContributionReceived on contributions", async function () {
      const { vault, owner } = await loadFixture(deployVaultFixture);
      const amount = parseEther("0.5");

      const hash = await vault.write.contribute([], { value: amount });
      const publicClient = await hre.viem.getPublicClient();
      await publicClient.waitForTransactionReceipt({ hash });

      const events = (await vault.getEvents.ContributionReceived()) as Array<{
        args: { contributor?: string; amount?: bigint };
      }>;
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.contributor).to.equal(
        getAddress(owner.account.address)
      );
      expect(events[0].args.amount).to.equal(amount);
    });

    it("Should revert when contributing after deadline", async function () {
      const { vault, deadline } = await loadFixture(deployVaultFixture);

      await time.increaseTo(deadline + 1n);

      await expectRevertWith(
        vault.write.contribute([], { value: 1n }),
        "Deadline has passed"
      );
    });
  });

  describe("Withdrawals", function () {
    it("Should allow owner to withdraw after goal is met", async function () {
      const { vault, goal, publicClient, owner } = await loadFixture(
        deployVaultFixture
      );

      await vault.write.contribute([], { value: goal });
      const contractBalanceBefore = await publicClient.getBalance({
        address: vault.address,
      });
      expect(contractBalanceBefore).to.equal(goal);

      const hash = await vault.write.withdraw();
      await publicClient.waitForTransactionReceipt({ hash });

      const contractBalanceAfter = await publicClient.getBalance({
        address: vault.address,
      });
      expect(contractBalanceAfter).to.equal(0n);
      expect(await vault.read.withdrawn()).to.equal(true);

      const events = (await vault.getEvents.FundsWithdrawn()) as Array<{
        args: { owner?: string; amount?: bigint };
      }>;
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.owner).to.equal(getAddress(owner.account.address));
      expect(events[0].args.amount).to.equal(goal);
    });

    it("Should revert when owner withdraws before goal is met", async function () {
      const { vault } = await loadFixture(deployVaultFixture);

      await vault.write.contribute([], { value: parseEther("1") });

      await expectRevertWith(vault.write.withdraw(), "Funding goal not met");
    });

    it("Should revert when non-owner tries to withdraw", async function () {
      const { vault, goal, otherAccount } = await loadFixture(deployVaultFixture);

      await vault.write.contribute([], { value: goal });

      const vaultAsOtherAccount = await hre.viem.getContractAt(
        "CommunityVault",
        vault.address,
        { walletClient: otherAccount }
      );

      await expectRevertWith(
        vaultAsOtherAccount.write.withdraw(),
        "OwnableUnauthorizedAccount"
      );
    });


    it("Should revert when non-owner tries to withdraw after goal is met", async function () {
      const { vault, goal, otherAccount, deadline } = await loadFixture(deployVaultFixture);

      const vaultAsOtherAccount = await hre.viem.getContractAt(
        "CommunityVault",
        vault.address,
        { walletClient: otherAccount }
      );

      await vaultAsOtherAccount.write.contribute([], { value: goal });

      await time.increaseTo(deadline + 1n);

      await expectRevertWith(
        vaultAsOtherAccount.write.withdraw(),
        "OwnableUnauthorizedAccount"
      );
    });

  });

  describe("Refunds", function () {
    it("Should allow a contributor to claim a refund after deadline when goal is not met", async function () {
      const { vault, deadline, publicClient, owner } = await loadFixture(
        deployVaultFixture
      );
      const amount = parseEther("1");

      await vault.write.contribute([], { value: amount });
      await time.increaseTo(deadline + 1n);

      const hash = await vault.write.refund();
      await publicClient.waitForTransactionReceipt({ hash });

      expect(await vault.read.contributions([owner.account.address])).to.equal(
        0n
      );
      expect(
        await publicClient.getBalance({
          address: vault.address,
        })
      ).to.equal(0n);

      const events = (await vault.getEvents.RefundClaimed()) as Array<{
        args: { contributor?: string; amount?: bigint };
      }>;
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.contributor).to.equal(
        getAddress(owner.account.address)
      );
      expect(events[0].args.amount).to.equal(amount);
    });

    it("Should not allow claiming refund twice", async function () {
      const { vault, deadline, publicClient } = await loadFixture(
        deployVaultFixture
      );
      const amount = parseEther("0.2");

      await vault.write.contribute([], { value: amount });
      await time.increaseTo(deadline + 1n);

      const hash = await vault.write.refund();
      await publicClient.waitForTransactionReceipt({ hash });

      await expectRevertWith(
        vault.write.refund(),
        "No contribution to refund"
      );
    });

    it("Should revert refunds if goal was met", async function () {
      const { vault, goal, deadline } = await loadFixture(deployVaultFixture);

      await vault.write.contribute([], { value: goal });
      await time.increaseTo(deadline + 1n);

      await expectRevertWith(vault.write.refund(), "Funding goal met");
    });

    it("Should fail if deployed with a past deadline", async function () {
      const pastDeadline = BigInt(await time.latest());

      await expectRevertWith(
        hre.viem.deployContract("CommunityVault", [parseEther("1"), pastDeadline]),
        "Deadline must be in the future"
      );
    });
  });
});
