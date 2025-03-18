import { ERROR_TYPES, MESSAGE_TYPES } from "./constants";
import { sendMessageToExtension } from "./utils";

export interface Delegation {
  id: string;
  poolId: string;
  amount: string;
  [key: string]: any;
}

export interface DelegationResponse {
  delegationId: string;
  poolId: string;
  [key: string]: any;
}

export interface CreateDelegationParams {
  poolId: string;
  referralCode?: string;
}

export const createDelegation = async ({ poolId, referralCode = "" }: CreateDelegationParams): Promise<DelegationResponse> => {
  if (!poolId) {
    throw new Error(ERROR_TYPES.INVALID_PARAMS);
  }
  
  try {
    const response = await sendMessageToExtension({
      message: MESSAGE_TYPES.DELEGATE,
      pool_id: poolId,
      referral_code: referralCode
    });
    
    if (!response.delegationId || !response.poolId) {
      throw new Error(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    return response as DelegationResponse;
  } catch (error) {
    console.error("Error creating delegation:", error);
    throw error;
  }
};

export interface AddStakeParams {
  delegationId: string;
  amount: string | number;
}

export interface StakingResponse {
  delegationId: string;
  amount: string;
  [key: string]: any;
}

export const addStake = async ({ delegationId, amount }: AddStakeParams): Promise<StakingResponse> => {
  if (!delegationId || !amount) {
    throw new Error(ERROR_TYPES.INVALID_PARAMS);
  }
  
  try {
    const response = await sendMessageToExtension({
      message: MESSAGE_TYPES.STAKE,
      delegation_id: delegationId,
      amount
    });
    
    if (!response.delegationId || !response.amount) {
      throw new Error(ERROR_TYPES.INVALID_RESPONSE);
    }
    
    return response as StakingResponse;
  } catch (error) {
    console.error("Error adding stake:", error);
    throw error;
  }
};

export const getDelegations = async (): Promise<Delegation[]> => {
  try {
    const response = await sendMessageToExtension({
      message: "getDelegations"
    });
    
    return response.delegations || [];
  } catch (error) {
    console.error("Error getting delegations:", error);
    throw error;
  }
}; 