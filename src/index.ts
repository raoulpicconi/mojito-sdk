import { SDK_VERSION, NETWORK_TYPES, WALLET_TYPES, TRANSACTION_MODES } from './constants';
import { initialize, getVersion, connect } from './core';
import { getAddresses, signMessage, sendTransaction } from './wallet';
import { createDelegation, addStake, getDelegations } from './staking';
import { getNFTs, sendNFT, mintNFT } from './nft';
import { formatAmount, parseAmount, isExtensionInstalled } from './utils';

/**
 * Mojito SDK
 */
const MojitoSDK = {
  // Constants
  VERSION: SDK_VERSION,
  NETWORK_TYPES,
  WALLET_TYPES,
  TRANSACTION_MODES,
  
  // Core methods
  initialize,
  getVersion,
  connect,
  isInstalled: isExtensionInstalled,
  
  // Wallet methods
  wallet: {
    getAddresses,
    signMessage,
    sendTransaction
  },
  
  // Staking methods
  staking: {
    createDelegation,
    addStake,
    getDelegations
  },
  
  // NFT methods
  nft: {
    getNFTs,
    sendNFT,
    mintNFT
  },
  
  // Utility methods
  utils: {
    formatAmount,
    parseAmount
  }
};

export default MojitoSDK; 