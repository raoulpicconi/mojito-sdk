import { EXTENSION_EVENTS, ERROR_TYPES, MESSAGE_TYPES } from "./constants";
import { sendMessageToExtension, isExtensionInstalled } from "./utils";

export interface InitResponse {
  version: string;
  extensionId: string;
}

export const initialize = async (): Promise<InitResponse> => {
  const installed = await isExtensionInstalled();
  if (!installed) {
    throw new Error(ERROR_TYPES.EXTENSION_NOT_FOUND);
  }
  
  return new Promise<InitResponse>((resolve) => {
    const handleInitResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.type === "MOJITO_INIT") {
        window.removeEventListener(EXTENSION_EVENTS.INIT_RESPONSE, handleInitResponse as EventListener);
        window.mojitoExtensionId = event.detail.extension_id;
        resolve({
          version: event.detail.version,
          extensionId: event.detail.extension_id
        });
      }
    };
    
    window.addEventListener(EXTENSION_EVENTS.INIT_RESPONSE, handleInitResponse as EventListener);
    const event = new CustomEvent(EXTENSION_EVENTS.INIT_REQUEST);
    window.dispatchEvent(event);
  });
};

export const getVersion = async (): Promise<string> => {
  try {
    const response = await sendMessageToExtension({
      message: MESSAGE_TYPES.VERSION
    });
    return response.version;
  } catch (error) {
    console.error("Error getting extension version:", error);
    throw error;
  }
};

export const connect = async (): Promise<boolean> => {
  try {
    const response = await sendMessageToExtension({
      message: MESSAGE_TYPES.CONNECT
    });
    return response.connected === true;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw error;
  }
}; 