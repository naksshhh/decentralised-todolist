// src/pinata.js
import axios from 'axios';

// Your Pinata API keys (replace with your actual keys)
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.REACT_APP_PINATA_SECRET_KEY;
// Function to upload data to Pinata
const uploadToPinata = async (content) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      content,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.IpfsHash; // Returns the IPFS hash
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};
const fetchFromPinata = async (ipfsHash) => {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response.data; // Returns the JSON data
    } catch (error) {
      console.error('Error fetching from Pinata:', error);
      throw error;
    }
  };
  
  // Export the functions
  export { uploadToPinata, fetchFromPinata };
