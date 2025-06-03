import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const Loan = await ethers.getContractFactory("LoanContract");
  const loan = await Loan.deploy();
  await loan.waitForDeployment();

  const address = await loan.getAddress();
  console.log("LoanContract deployed to:", address);

  fs.writeFileSync(
    path.join(__dirname, "../contract-address.json"),
    JSON.stringify({ address }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
