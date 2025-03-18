import { ERROR_TYPES, EXTENSION_EVENTS } from "./constants";

// Define extension message interfaces
export interface ExtensionMessage {
  message: string;
  [key: string]: any;
}

export interface ExtensionResponse {
  [key: string]: any;
}

// Add Window interface extension
declare global {
  interface Window {
    mojitoExtensionId?: string;
  }
}

export const sendMessageToExtension = async (message: ExtensionMessage): Promise<ExtensionResponse> => {
  return new Promise((resolve, reject) => {
    if (!window.mojitoExtensionId) {
      reject(new Error(ERROR_TYPES.EXTENSION_NOT_FOUND));
      return;
    }
    
    // FIXME
    const messageId = Date.now().toString();
    const messageWithId = { ...message, id: messageId };
    
    const handleResponse = (event: any) => {
      if (event.data && event.data.id === messageId) {
        window.removeEventListener('message', handleResponse);
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data.result);
        }
      }
    };
    
    window.addEventListener('message', handleResponse);
    
    window.postMessage({
      direction: 'from-page-script',
      message: messageWithId
    }, '*');
    
    // Timeout after 30 seconds
    setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      reject(new Error('Request timed out'));
    }, 30000);
  });
};

export const isExtensionInstalled = async (): Promise<boolean> => {
  try {
    const event = new CustomEvent(EXTENSION_EVENTS.INIT_REQUEST);
    window.dispatchEvent(event);
    
    return new Promise((resolve) => {
      const handleResponse = (event: any) => {
        if (event.detail && event.detail.type === 'MOJITO_INIT') {
          window.removeEventListener(EXTENSION_EVENTS.INIT_RESPONSE, handleResponse);
          resolve(true);
        }
      };
      
      window.addEventListener(EXTENSION_EVENTS.INIT_RESPONSE, handleResponse);
      
      // Timeout after 2 seconds
      setTimeout(() => {
        window.removeEventListener(EXTENSION_EVENTS.INIT_RESPONSE, handleResponse);
        resolve(false);
      }, 2000);
    });
  } catch (error) {
    console.error('Error checking for Mojito extension:', error);
    return false;
  }
};

export const formatAmount = (amount: string | number, decimals: number = 11): string => {
  const amountNum = typeof amount === "string" ? parseFloat(amount) : amount;
  const divisor = Math.pow(10, decimals);
  return (amountNum / divisor).toFixed(decimals).replace(/\.?0+$/, "");
};

export const parseAmount = (amount: string | number, decimals: number = 11): string => {
  const amountNum = typeof amount === "string" ? parseFloat(amount) : amount;
  const multiplier = Math.pow(10, decimals);
  return Math.floor(amountNum * multiplier).toString();
}; 