// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        string ipfsHash; // Hash of the task stored on IPFS
        bool completed;   // Status of the task
    }

    Task[] public tasks; // Array to hold all tasks

    event TaskAdded(uint256 taskId, string ipfsHash);    // Event for adding a task
    event TaskCompleted(uint256 taskId);                  // Event for completing a task
    event TaskDeleted(uint256 taskId);                    // Event for deleting a task

    // Function to add a new task
    function addTask(string memory _ipfsHash) public {
        tasks.push(Task(_ipfsHash, false)); // Add task to the array
        emit TaskAdded(tasks.length - 1, _ipfsHash); // Emit event
    }

    // Function to mark a task as completed
    function completeTask(uint _index) public {
        require(_index < tasks.length, "Task does not exist"); // Check if task exists
        tasks[_index].completed = true; // Mark task as completed
        emit TaskCompleted(_index); // Emit event
    }

    // Function to delete a task
    function deleteTask(uint _index) public {
        require(_index < tasks.length, "Task does not exist"); // Check if task exists
        for (uint i = _index; i < tasks.length - 1; i++) {
            tasks[i] = tasks[i + 1]; // Shift tasks left
        }
        tasks.pop(); // Remove the last task
        emit TaskDeleted(_index); // Emit event
    }

    // Function to get all tasks
    function getTasks() public view returns (Task[] memory) {
        return tasks; // Return the array of tasks
    }

    // Function to get a single task (optional)
    function getTask(uint _index) public view returns (string memory, bool) {
        require(_index < tasks.length, "Task does not exist"); // Check if task exists
        Task memory task = tasks[_index]; // Retrieve task
        return (task.ipfsHash, task.completed); // Return task details
    }

    // Function to get the total number of tasks
    function getTaskCount() public view returns (uint) {
        return tasks.length; // Return the count of tasks
    }
}
