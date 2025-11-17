const { ethers } = require("hardhat");

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // from step 1

  const insurance = await ethers.getContractAt(
    "InsuranceContract",
    contractAddress
  );

  const ids = await insurance.getPolicy(0);

}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
