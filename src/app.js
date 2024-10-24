import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import TodoListABI from './contracts/TodoList.json';
import { uploadToPinata, fetchFromPinata } from './pinata.js'; // Import Pinata functions

// Constants
const CONTRACT_ADDRESS = '0x048c4924232F28AE50298BFaDbD7DAe42212F552';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const web3Modal = new Web3Modal({ 
    cacheProvider: true, 
    providerOptions: {} 
  });

  useEffect(() => {
    if (contract) {
      loadTasks();
    }
  }, [contract]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Connecting wallet...');
      
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setDebugInfo('Getting contract...');
      const todoContract = new ethers.Contract(CONTRACT_ADDRESS, TodoListABI.abi, signer);
      
      setDebugInfo('Wallet connected successfully');
      setWalletAddress(address);
      setContract(todoContract);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(`Wallet connection failed: ${err.message}`);
      setDebugInfo(`Wallet error details: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      setLoading(true);
      setError('');
      setDebugInfo('Preparing data for IPFS...');

      const content = {
        task: newTask.trim()
      };

      setDebugInfo('Uploading to Pinata...');
      const ipfsHash = await uploadToPinata(content);
      setDebugInfo(`Successfully uploaded to Pinata with hash: ${ipfsHash}`);

      // Continue with blockchain transaction
      const tx = await contract.addTask(ipfsHash);
      setDebugInfo('Waiting for transaction confirmation...');
      await tx.wait();

      setDebugInfo('Task added successfully!');
      setNewTask('');
      await loadTasks();
    } catch (err) {
      console.error('Error adding task:', err);
      setError(err.message);
      setDebugInfo(`Full error details: ${JSON.stringify(err, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setDebugInfo('Loading tasks from blockchain...');

      const tasksFromChain = await contract.getTasks();
      setDebugInfo(`Found ${tasksFromChain.length} tasks on chain`);

      const tasksWithIPFS = await Promise.all(
        tasksFromChain.map(async (task) => {
          try {
            setDebugInfo(`Fetching IPFS data for hash: ${task.ipfsHash}`);
            const content = await fetchFromPinata(task.ipfsHash);
            return {
              ipfsHash: task.ipfsHash,
              description: content.task, // Assuming the uploaded content has a 'task' property
              completed: task.completed
            };
          } catch (error) {
            console.error("Pinata error:", error);
            return {
              ipfsHash: task.ipfsHash,
              description: "Failed to load task",
              completed: task.completed
            };
          }
        })
      );

      setTasks(tasksWithIPFS);
      setDebugInfo('Tasks loaded successfully');
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(`Failed to load tasks: ${err.message}`);
      setDebugInfo(`Load tasks error details: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Decentralized Todo List</h1>
      
      {walletAddress && (
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Connected: {walletAddress}
        </p>
      )}

      {!walletAddress ? ( 
        <button 
          onClick={connectWallet}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <form onSubmit={handleAddTask} style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
            disabled={loading}
            style={{
              width: '70%',
              padding: '0.5rem',
              marginRight: '1rem',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <button
            type="submit"
            disabled={loading || !newTask.trim()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      )}

      {error && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: '#FEE2E2', 
          color: '#DC2626',
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      {/* Debug Information Panel */}
      <div style={{ 
        padding: '1rem', 
        marginBottom: '1rem', 
        backgroundColor: '#F3F4F6', 
        borderRadius: '4px',
        fontSize: '0.875rem'
      }}>
        <h3>Debug Information:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {debugInfo}
        </pre>
      </div>

      {tasks.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task, index) => (
            <li key={index} style={{ 
              padding: '1rem',
              marginBottom: '0.5rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.description}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
