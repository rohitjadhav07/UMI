const hre = require("hardhat");

async function main() {
  console.log("Deploying StreamMall contract...");

  // Get the contract factory
  const StreamMall = await hre.ethers.getContractFactory("StreamMall");
  
  // Deploy the contract
  const streamMall = await StreamMall.deploy();
  await streamMall.waitForDeployment();

  const contractAddress = await streamMall.getAddress();
  console.log("StreamMall deployed to:", contractAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the contract on Etherscan (if not on hardhat network)
  if (hre.network.name !== "hardhat") {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("Deployment completed!");
  console.log("Contract address:", contractAddress);
  console.log("Add this address to your .env file as STREAMFLOW_CONTRACT_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });