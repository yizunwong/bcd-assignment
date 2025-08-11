const { ethers } = require("hardhat");

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // from step 1

  const insurance = await ethers.getContractAt(
    "InsuranceContract",
    contractAddress
  );

  // console.log("Connected to InsuranceContract at:", user);

  // // Create a policy as `user`
  // const coverage = ethers.parseEther("10"); // example
  // const premium = ethers.parseEther("0.1"); // example
  // const days = 90;

  // const tx = await insurance
  //   .connect(user)
  //   .createPolicyWithPayment(coverage, premium, days, { value: premium });
  // await tx.wait();

  // console.log("Policy created by user", tx);

  // // Now call the view function correctly: pass the USER address as the param
  const ids = await insurance.getPolicy(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
