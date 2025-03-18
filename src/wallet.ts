import { ERROR_TYPES } from "./constants";
import { sendMessageToExtension } from "./utils";

export interface WalletAddress {
  address: string;
  type: string;
  network: string;
}

export interface SignMessageResponse {
  signature: string;
  message: string;
}

export interface TransactionResponse {
  txId: string;
  [key: string]: any;
}

export const getAddresses = async (): Promise<WalletAddress[]> => {
  try {
    const response = await sendMessageToExtension({
      message: "getAddresses"
    });
    
    if (!response || !response.addresses) {
      throw new Error(ERROR_TYPES.CONNECTION_FAILED);
    }
    
    return response.addresses;
  } catch (error) {
    console.error("Error getting wallet addresses:", error);
    throw error;
  }
};

export const signMessage = async (message: string): Promise<SignMessageResponse> => {
  if (!message) {
    throw new Error(ERROR_TYPES.INVALID_PARAMS);
  }
  
  try {
    const response = await sendMessageToExtension({
      message: "signMessage",
      data: { message }
    });
    
    if (!response.signature || !response.message) {
      throw new Error(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    return response as SignMessageResponse;
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};

export interface SendTransactionParams {
  to: string;
  amount: string | number;
  tokenId?: string;
}

export const sendTransaction = async ({ to, amount, tokenId }: SendTransactionParams): Promise<TransactionResponse> => {
  if (!to || !amount) {
    throw new Error(ERROR_TYPES.INVALID_PARAMS);
  }
  
  try {
    const response = await sendMessageToExtension({
      message: "sendTransaction",
      data: {
        to,
        amount,
        tokenId
      }
    });
    
    if (!response.txId) {
      throw new Error(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    return response as TransactionResponse;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}; 