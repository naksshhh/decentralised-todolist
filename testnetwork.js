const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/1f2ecc2e61814c51aeb5b9c4b4fff1de");
  
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
  } catch (error) {
    console.error("Error connecting to network:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
