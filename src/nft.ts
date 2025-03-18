import { ERROR_TYPES } from "./constants";
import { sendMessageToExtension } from "./utils";

export interface NFT {
  tokenId: string;
  metadata: Record<string, any>;
  [key: string]: any;
}

export interface NFTTransactionResponse {
  txId: string;
  [key: string]: any;
}

export const getNFTs = async (): Promise<NFT[]> => {
  try {
    const response = await sendMessageToExtension({
      message: "getNFTs"
    });
    
    return response.nfts || [];
  } catch (error) {
    console.error("Error getting NFTs:", error);
    throw error;
  }
};

export interface SendNFTParams {
  tokenId: string;
  to: string;
}

export const sendNFT = async ({ tokenId, to }: SendNFTParams): Promise<NFTTransactionResponse> => {
  if (!tokenId || !to) {
    throw new Error(ERROR_TYPES.INVALID_PARAMS);
  }
  
  try {
    const response = await sendMessageToExtension({
      message: "sendNFT",
      data: {
        tokenId,
        to
      }
    });
    
    if (!response.txId) {
      throw new Error(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    return response as NFTTransactionResponse;
  } catch (error) {
    console.error("Error sending NFT:", error);
    throw error;
  }
};

export interface MintNFTParams {
  metadata: Record<string, any>;
}

export const mintNFT = async ({ metadata }: MintNFTParams): Promise<NFTTransactionResponse> => {
  if (!metadata) {
    throw new Error(ERROR_TYPES.INVALID_PARAMS);
  }
  
  try {
    const response = await sendMessageToExtension({
      message: "mintNFT",
      data: {
        metadata
      }
    });

    if (!response.txId) {
      throw new Error(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    return response as NFTTransactionResponse;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}; 