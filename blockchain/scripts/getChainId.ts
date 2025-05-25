const hre = require("hardhat");

async function main() {
  // Get the network provider
  const network = await hre.ethers.provider.getNetwork();

  // Log the chain ID
  console.log(`Connected to network: ${network.name}`);
  console.log(`Chain ID: ${network.chainId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
