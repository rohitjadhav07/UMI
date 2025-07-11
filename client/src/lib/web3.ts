import { Web3 } from 'web3';
import { Contract } from 'web3-eth-contract';
import type { Web3Config, ContractConfig } from '@shared/schema';

// StreamMall Smart Contract ABI
export const STREAMMALL_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "contentId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pricePerMinute",
        "type": "uint256"
      }
    ],
    "name": "ContentCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "contentId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pricePerMinute",
        "type": "uint256"
      }
    ],
    "name": "ContentUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "streamId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "streamId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalCost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalMinutes",
        "type": "uint256"
      }
    ],
    "name": "StreamEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "streamId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "contentId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "StreamStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isCreator",
        "type": "bool"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_contentUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_thumbnailUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_pricePerMinute",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "_tags",
        "type": "string[]"
      }
    ],
    "name": "createContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_streamId",
        "type": "uint256"
      }
    ],
    "name": "endStream",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_streamId",
        "type": "uint256"
      }
    ],
    "name": "emergencyEndStream",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getActiveStreams",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllActiveContent",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_contentId",
        "type": "uint256"
      }
    ],
    "name": "getContent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "contentUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "thumbnailUrl",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pricePerMinute",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "totalViews",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalEarnings",
            "type": "uint256"
          },
          {
            "internalType": "string[]",
            "name": "tags",
            "type": "string[]"
          }
        ],
        "internalType": "struct StreamMall.Content",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContentCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      }
    ],
    "name": "getCreatorContent",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_streamId",
        "type": "uint256"
      }
    ],
    "name": "getStream",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "contentId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalMinutes",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalCost",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "lastPaymentTime",
            "type": "uint256"
          }
        ],
        "internalType": "struct StreamMall.Stream",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStreamCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getUser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "walletAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "email",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isCreator",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "totalEarnings",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalSpent",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "contentIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "streamIds",
            "type": "uint256[]"
          }
        ],
        "internalType": "struct StreamMall.User",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_userAddress",
        "type": "address"
      }
    ],
    "name": "getUserStreams",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_username",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_isCreator",
        "type": "bool"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_contentId",
        "type": "uint256"
      }
    ],
    "name": "startStream",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_contentId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_pricePerMinute",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isActive",
        "type": "bool"
      }
    ],
    "name": "updateContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newFee",
        "type": "uint256"
      }
    ],
    "name": "updatePlatformFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawPlatformFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Web3 Configuration
export const WEB3_CONFIG: Web3Config = {
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '',
  chainId: 11155111, // Sepolia testnet
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
  explorerUrl: 'https://sepolia.etherscan.io',
};

// Web3 instance
let web3Instance: Web3 | null = null;
let contractInstance: Contract<typeof STREAMMALL_ABI> | null = null;

// Initialize Web3
export const initializeWeb3 = async (): Promise<Web3> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    web3Instance = new Web3(window.ethereum);
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Switch to correct network if needed
    await switchToCorrectNetwork();
    
    return web3Instance;
  }
  
  throw new Error('Web3 wallet not detected. Please install Rabby or MetaMask.');
};

// Get Web3 instance
export const getWeb3 = (): Web3 => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized. Call initializeWeb3() first.');
  }
  return web3Instance;
};

// Get contract instance
export const getContract = (): Contract<typeof STREAMMALL_ABI> => {
  if (!contractInstance) {
    const web3 = getWeb3();
    contractInstance = new web3.eth.Contract(STREAMMALL_ABI, WEB3_CONFIG.contractAddress);
  }
  return contractInstance;
};

// Switch to correct network
export const switchToCorrectNetwork = async (): Promise<void> => {
  if (!window.ethereum) return;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${WEB3_CONFIG.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask/Rabby
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${WEB3_CONFIG.chainId.toString(16)}`,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [WEB3_CONFIG.rpcUrl],
              blockExplorerUrls: [WEB3_CONFIG.explorerUrl],
            },
          ],
        });
      } catch (addError) {
        console.error('Failed to add network:', addError);
      }
    } else {
      console.error('Failed to switch network:', switchError);
    }
  }
};

// Utility functions
export const formatEther = (wei: string): string => {
  return Web3.utils.fromWei(wei, 'ether');
};

export const parseEther = (ether: string): string => {
  return Web3.utils.toWei(ether, 'ether');
};

export const formatWei = (wei: string): string => {
  return parseFloat(formatEther(wei)).toFixed(4);
};

export const isValidAddress = (address: string): boolean => {
  return Web3.utils.isAddress(address);
};

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Transaction utilities
export const sendTransaction = async (
  method: any,
  from: string,
  value: string = '0'
): Promise<any> => {
  const gasEstimate = await method.estimateGas({ from, value });
  const gasPrice = await getWeb3().eth.getGasPrice();
  
  return method.send({
    from,
    value,
    gas: gasEstimate,
    gasPrice,
  });
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  try {
    const accounts = await getWeb3().eth.getAccounts();
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Get ETH balance
export const getEthBalance = async (address: string): Promise<string> => {
  try {
    const balance = await getWeb3().eth.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error('Error getting ETH balance:', error);
    return '0';
  }
};

// Event listening
export const subscribeToEvents = (
  eventName: string,
  callback: (event: any) => void,
  filter: any = {}
): void => {
  const contract = getContract();
  const subscription = contract.events[eventName](filter);
  
  subscription.on('data', callback);
  subscription.on('error', (error) => {
    console.error(`Error subscribing to ${eventName}:`, error);
  });
};

// Contract interaction helpers
export const contractMethods = {
  // User methods
  registerUser: async (username: string, email: string, isCreator: boolean, from: string) => {
    const contract = getContract();
    const method = contract.methods.registerUser(username, email, isCreator);
    return sendTransaction(method, from);
  },

  getUser: async (address: string) => {
    const contract = getContract();
    return contract.methods.getUser(address).call();
  },

  // Content methods
  createContent: async (
    title: string,
    description: string,
    category: string,
    contentUrl: string,
    thumbnailUrl: string,
    pricePerMinute: string,
    duration: number,
    tags: string[],
    from: string
  ) => {
    const contract = getContract();
    const method = contract.methods.createContent(
      title,
      description,
      category,
      contentUrl,
      thumbnailUrl,
      pricePerMinute,
      duration,
      tags
    );
    return sendTransaction(method, from);
  },

  getContent: async (contentId: number) => {
    const contract = getContract();
    return contract.methods.getContent(contentId).call();
  },

  getAllActiveContent: async () => {
    const contract = getContract();
    return contract.methods.getAllActiveContent().call();
  },

  getCreatorContent: async (creatorAddress: string) => {
    const contract = getContract();
    return contract.methods.getCreatorContent(creatorAddress).call();
  },

  // Stream methods
  startStream: async (contentId: number, from: string, value: string) => {
    const contract = getContract();
    const method = contract.methods.startStream(contentId);
    return sendTransaction(method, from, value);
  },

  endStream: async (streamId: number, from: string) => {
    const contract = getContract();
    const method = contract.methods.endStream(streamId);
    return sendTransaction(method, from);
  },

  getStream: async (streamId: number) => {
    const contract = getContract();
    return contract.methods.getStream(streamId).call();
  },

  getActiveStreams: async (userAddress: string) => {
    const contract = getContract();
    return contract.methods.getActiveStreams(userAddress).call();
  },

  getUserStreams: async (userAddress: string) => {
    const contract = getContract();
    return contract.methods.getUserStreams(userAddress).call();
  },
};

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}