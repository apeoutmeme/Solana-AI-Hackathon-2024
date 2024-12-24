/**
 * Transaction Processor
 * 
 * A utility service for processing blockchain transactions with retry capabilities
 * and concurrent queue management.
 * 
 * Required Environment Variables:
 * - RPC_URL: Your blockchain RPC endpoint
 * - TOKEN_API_URL: Your token metadata API endpoint
 */

import fetch from 'node-fetch';

// Utility for delayed execution
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom error for retryable operations
class RetryableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RetryableError';
  }
}

// Enhanced fetch with exponential backoff
async function fetchWithRetry(url, options, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after')) || Math.pow(2, attempt);
        throw new RetryableError(`Rate limited. Retry after ${retryAfter}s`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      
      if (error instanceof RetryableError || error.name === 'FetchError') {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${delay}ms...`);
        await wait(delay);
        continue;
      }
      
      throw error;
    }
  }

  throw lastError;
}

// Process blockchain transaction
export async function processTransaction(signature) {
  try {
    console.log(`Processing transaction ${signature}...`);
    
    // Implementation note: Replace with your RPC endpoint
    const data = await fetchWithRetry(
      process.env.RPC_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTransaction",
          params: [
            signature,
            { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }
          ]
        })
      }
    );

    // Implementation note: Add your transaction validation logic
    return processTransactionData(data);
  } catch (error) {
    handleProcessingError(error, signature);
    return null;
  }
}

// Fetch token metadata
export async function fetchTokenMetadata(tokenAddress) {
  try {
    console.log(`Fetching metadata for ${tokenAddress}...`);
    
    // Implementation note: Replace with your token API endpoint
    const data = await fetchWithRetry(
      `${process.env.TOKEN_API_URL}/tokens/${tokenAddress}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    return formatTokenMetadata(data);
  } catch (error) {
    console.error(`Error fetching metadata for ${tokenAddress}:`, error);
    return null;
  }
}

// Processing queue management
const processingQueue = new Map();
const CONFIG = {
  MAX_CONCURRENT_PROCESSING: 3,
  PROCESSING_TIMEOUT: 30000 // 30 seconds
};

export function getProcessingStatus() {
  return {
    processing: processingQueue.size,
    maxConcurrent: CONFIG.MAX_CONCURRENT_PROCESSING
  };
}

export async function addToProcessingQueue(signature) {
  if (!isValidForProcessing(signature)) {
    return false;
  }

  processingQueue.set(signature, Date.now());
  setupProcessingTimeout(signature);
  return true;
}

export function removeFromProcessingQueue(signature) {
  return processingQueue.delete(signature);
}

// Private helper functions
function isValidForProcessing(signature) {
  return !processingQueue.has(signature) && 
         processingQueue.size < CONFIG.MAX_CONCURRENT_PROCESSING;
}

function setupProcessingTimeout(signature) {
  setTimeout(() => {
    if (processingQueue.has(signature)) {
      processingQueue.delete(signature);
      console.log(`Processing timeout for ${signature}`);
    }
  }, CONFIG.PROCESSING_TIMEOUT);
}

function processTransactionData(data) {
  if (!data.result) {
    return null;
  }

  // Implementation note: Add your transaction data processing logic
  return {
    signature: data.result.transaction?.signatures?.[0],
    timestamp: Date.now()
  };
}

function formatTokenMetadata(data) {
  if (!data) {
    return null;
  }

  return {
    name: data.name || 'Unknown Token',
    description: data.description || 'No description available',
    image_uri: data.image_uri || 'default_image_url'
  };
}

function handleProcessingError(error, signature) {
  if (error instanceof RetryableError) {
    console.log(`Retryable error for ${signature}: ${error.message}`);
  } else {
    console.error(`Fatal error processing transaction ${signature}:`, error);
  }
}
