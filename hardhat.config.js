require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Loads environment variables from .env file

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Use your MetaMask private key here
      timeout: 20000,
    },
  },
};
