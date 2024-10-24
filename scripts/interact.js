const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();
    
    // Replace with your deployed contract address
    const todoListAddress = "0x048c4924232F28AE50298BFaDbD7DAe42212F552"; 
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.attach(todoListAddress);

    // Add some tasks
    await todoList.addTask("QmXyz123..."); // Replace with actual IPFS hash
    console.log("Task added: Learn Solidity");
    await todoList.addTask("QmAbc456..."); // Replace with actual IPFS hash
    console.log("Task added: Build a decentralized application");

    // Get the total task count
    const count = await todoList.getTaskCount();
    console.log(`Total tasks: ${count}`);
    
    // Fetch and log tasks
    for (let i = 0; i < count; i++) {
        const task = await todoList.getTask(i);
        console.log(`Task ${i}: ${task[0]} | Completed: ${task[1]}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
