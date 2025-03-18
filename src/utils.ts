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

export const sendMessageToExtension = async (data: ExtensionMessage): Promise<ExtensionResponse> => {
  // The implementation would go here
  // This is a placeholder assuming similar implementation to the JS version
  if (!window.mojitoExtensionId) {
    throw new Error("Extension not initialized");
  }
  
  // Implementation of extension communication would go here
  return Promise.resolve({});
};

export const isExtensionInstalled = async (): Promise<boolean> => {
  // Implementation would go here
  return Promise.resolve(false);
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