# Decentralized To-Do List DApp

This is a decentralized To-Do List DApp built on the Ethereum blockchain and IPFS. It allows users to manage tasks in a decentralized manner by uploading task details to IPFS and storing the task's metadata on the Ethereum blockchain.

## Features

- Add new tasks to the decentralized To-Do List.
- Upload task details to IPFS.
- Store IPFS hashes of tasks on the Ethereum blockchain.
- Mark tasks as completed or delete them.
- Connect with Ethereum wallets using Web3Modal.

## Technologies

- **Ethereum Smart Contract**: Solidity
- **IPFS**: Decentralized storage for task descriptions
- **React.js**: Frontend interface
- **Web3Modal**: Wallet connection (e.g., MetaMask)
- **Ethers.js**: Ethereum JavaScript library for interaction with the contract
- **Infura**: IPFS node and Ethereum gateway provider

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) or any other Ethereum wallet
- [Infura IPFS API](https://infura.io/product/ipfs)  or [Pinata IPFS API](https://app.pinata.cloud/developers/api-keys) (used to interact with IPFS)
- [Ganache](https://www.trufflesuite.com/ganache) or [Sepolia (from Infura)](https://app.infura.io) an Ethereum test network (e.g., Rinkeby) for testing smart contracts

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/todo-dapp.git
    cd todo-dapp
    ```

2. **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```

3. **Configure Infura**:
    Open the `hardhat.config.js` file and replace the placeholder for Infura credentials with your **Infura Project ID** and **Account Private Key**:

    ```javascript
    const projectId = 'yourProjectId';  // Replace with your Infura Project ID
    const projectSecret = 'accountprivatekey';  // Replace with your Metamask account private key
    ```
4. **Use Hardhat:**
    To compile the smart contract
    ```bash
    npx hardhat compile
    ```
    To test the dependencies and environment
    ```bash
    npx hardhat run test.js 
    ```
    To test the network setup
    ```bash
    npx hardhat run testnetwork.js --network sepolia
    ```
    To deploy the smart contract onto test network `sepolia`
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```
    Add the deployed smart contract address in  `scripts/interact.js` to interact with the smart contract and run this command
    ```bash
    npx hardhat run scripts/interact.js --network sepolia
    ```
    Once deployed, update the `CONTRACT_ADDRESS` in `App.js` with your contract's deployed address.

5. **Set up IPFS API**
    Either visit Infura or Pinata to create a new API and update the `pinata.js` with API Key and Secret Key.
    You can also run the IPFS on local environment by installing step:

    First, download IPFS (Kubo):


    Go to: https://dist.ipfs.tech/#kubo
    Click on "Windows" under the "Download Kubo" section
    This will download a zip file named something like `kubo_v0.25.0_windows-amd64.zip`


    Install IPFS:

    ```bash
    1. Right-click the downloaded zip file and select "Extract All..."
    2. Choose a destination folder (e.g., C:\IPFS)
    3. Inside the extracted folder, you'll find `ipfs.exe`
    ```
    Add to PATH:

    ```bash
    1. Press Windows key + R
    2. Type "sysdm.cpl" and press Enter
    3. Go to "Advanced" tab
    4. Click "Environment Variables" button
    5. Under "System Variables", find and select "Path"
    6. Click "Edit"
    7. Click "New"
    8. Add the full path to the folder containing ipfs.exe (e.g., C:\IPFS)
    9. Click "OK" on all windows

    Very Important: Close and reopen your Command Prompt after adding to PATH
    ```
    To verify installation, open a new Command Prompt and type:

    ```bash
    ipfs --version
    ```
    Initialize IPFS:

    ```bash
    ipfs init
    ```
    Configure CORS (run these after installation is complete):

    ```bash
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
    ```
    Start the IPFS daemon:

    ```bash
    ipfs daemon
    ```
5. **Start the development server**:
    ```bash
    npm start
    ```

    This will start the React development server, and you can interact with the dApp at `http://localhost:3000`.

## Project Structure
```bash
├── contracts/          # Smart contracts directory
│   └── TodoList.sol    # Solidity smart contract
├── public/             # Deployment scripts
│   └── index.html      # Script to deploy the contract
├── scripts/            # Deployment scripts
│   └── deploy.js       # Script to deploy the contract
│   └── interact.js     # Script to interact with the contract
├── src/                # Frontend source files
│   ├── App.js          # Main React component
│   ├── index.js        # DOM component
│   ├── pinata.js       # IPSC integration
│   └── contracts/      # ABI files for smart contracts
├── README.md           # This file
├── hardhat.config.js   # Hardhat configuration for the project
└── package.json        # npm dependencies and scripts
└── .env                # File to hold private keys
```

## Usage
Open the app in your browser at http://localhost:3000/.

Connect your Ethereum wallet using the Connect Wallet button (ensure you're on the same network as the smart contract deployment).

Add tasks to the list. Task descriptions are uploaded to IPFS, and their hashes are stored on the blockchain.

View the tasks in the list. You can mark tasks as complete or delete them.

## Smart Contract
The smart contract for the To-Do List is deployed on the Ethereum network and interacts with IPFS to store task details in a decentralized manner.

Main Functions:
```
addTask(string ipfsHash): Adds a task to the list by storing its IPFS hash on the blockchain.

getTasks(): Fetches all tasks from the blockchain.

completeTask(uint taskId): Marks a task as completed.

deleteTask(uint taskId): Deletes a task.
```
## IPFS Integration
Tasks are uploaded to IPFS using the `ipfs-http-client library`, and only the resulting hash (CID) is stored on the Ethereum blockchain. This ensures that task data is decentralized and not stored on any single server.

To configure IPFS, we use `Infura/Pinata` as an IPFS provider. The credentials (projectId and projectSecret) are used to authenticate with same.

## IPFS Issues
If you're getting a `400` error when uploading to IPFS, ensure that:

You have the correct projectId and projectSecret from Infura/Pinata.
The IPFS daemon is running if using a local IPFS node.

You're using a valid Content Identifier (CID) when accessing files via IPFS.
## Ethereum Network Issues
Ensure you're connected to the correct Ethereum network (e.g., Sepolia or a local Ganache instance).

Ensure that MetaMask or the chosen wallet has enough test ETH for transactions. Use [Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) for sepolia testnet.
## Future Improvements
Enable task categorization and prioritization.

Add user authentication using ENS (Ethereum Name Service).

Implement notifications for completed tasks.