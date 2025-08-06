import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying InsuranceContract...');

  const InsuranceContract =
    await ethers.getContractFactory('InsuranceContract');
  const insuranceContract = await InsuranceContract.deploy();

  await insuranceContract.waitForDeployment();

  const address = await insuranceContract.getAddress();
  console.log('InsuranceContract deployed to:', address);

  // Save the contract address to a file for frontend use
  const fs = require('fs');
  const path = require('path');

  const contractAddresses = {
    InsuranceContract: address,
    network: 'hardhat', // Change this based on your network
    deployedAt: new Date().toISOString(),
  };

  const addressesPath = path.join(
    __dirname,
    '../deployed/InsuranceContract.address.json'
  );
  fs.writeFileSync(addressesPath, JSON.stringify(contractAddresses, null, 2));

  console.log('Contract addresses saved to:', addressesPath);
  console.log('Deployment completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
