const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList Contract", function () {
    let TodoList;
    let todoList;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        TodoList = await ethers.getContractFactory("TodoList");
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy a new contract for each test
        todoList = await TodoList.deploy();
        await todoList.deployed();
    });

    describe("Deployment", function () {
        it("Should deploy the contract", async function () {
            expect(todoList.address).to.not.be.null;
        });
    });

    describe("Tasks", function () {
        it("Should create a new task", async function () {
            await todoList.addTask("Learn Solidity");

            const task = await todoList.tasks(0);
            expect(task.ipfsHash).to.equal("Learn Solidity"); // Accessing ipfsHash instead of description
            expect(task.completed).to.equal(false);
        });

        it("Should mark a task as completed", async function () {
            await todoList.addTask("Learn Solidity");
            await todoList.completeTask(0);

            const task = await todoList.tasks(0);
            expect(task.completed).to.equal(true);
        });

        it("Should retrieve the total number of tasks", async function () {
            await todoList.addTask("Task 1");
            await todoList.addTask("Task 2");

            expect(await todoList.getTaskCount()).to.equal(2);
        });

        it("Should not allow non-owners to complete tasks", async function () {
            await todoList.addTask("Learn Solidity");
            await expect(todoList.connect(addr1).completeTask(0)).to.be.revertedWith("Only owner can complete tasks");
        });
    });
});
