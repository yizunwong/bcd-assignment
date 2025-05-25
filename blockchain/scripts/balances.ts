import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    const balance = await ethers.provider.getBalance(account.address);
    console.log(`${account.address}: ${ethers.formatEther(balance)} ETH`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
