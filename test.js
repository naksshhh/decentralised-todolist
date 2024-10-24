const { ethers } = require("hardhat");

async function main() {
  console.log("Ethers version:", ethers.version);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
