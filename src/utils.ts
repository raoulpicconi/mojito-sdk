import { ERROR_TYPES, EXTENSION_EVENTS, MESSAGE_TYPES } from "./constants";

// Define extension message interfaces
export interface ExtensionMessage {
  message?: string;
  action?: string;
  [key: string]: any;
}

export interface ExtensionResponse {
  [key: string]: any;
}

// Add Window interface extension
declare global {
  interface Window {
    mojito?: {
      extensionId: string;
      version: string;
    };
  }
}

declare const chrome: {
  runtime: {
    sendMessage: (extensionId: string, message: any, options: any) => Promise<any>;
    lastError?: { message: string };
  };
};

declare const browser: {
  runtime: {
    sendMessage: (extensionId: string, message: any, options: any) => Promise<any>;
    lastError?: { message: string };
  };
};

const getBrowserRuntime = () => {
  if (typeof browser !== 'undefined' && !!browser.runtime) {
    return browser.runtime;
  }

  if (typeof chrome !== 'undefined' && !!chrome.runtime) {
    return chrome.runtime;
  }

  return undefined;
}

export const sendMessageToExtension = async (message: ExtensionMessage): Promise<ExtensionResponse> => {
    if (!window.mojito?.extensionId) {
      throw new Error(ERROR_TYPES.EXTENSION_NOT_FOUND);
    }

    const runtime = getBrowserRuntime();
    
    if (typeof runtime !== 'undefined') {
      try {
        const res = await runtime.sendMessage(
          window.mojito.extensionId,
          message,
          {}
        );

        return res;
      } catch (error) {
        console.error("sendMessageToExtension error:", error);
        throw new Error(ERROR_TYPES.EXTENSION_NOT_FOUND);
      }
    } else {
      // FIXME: in firefox opens multiple popup windows
      return new Promise((resolve, reject) => {
        const messageId = Math.random().toString(36).substring(2, 15);
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
        }, window.location.origin);

        setTimeout(() => {
          window.removeEventListener('message', handleResponse);
          reject(new Error('Request timed out'));
        }, 5000);
      });
    }
  }

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