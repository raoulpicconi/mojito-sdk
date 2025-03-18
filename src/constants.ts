export const SDK_VERSION = "0.1.0";

export const NETWORK_TYPES = {
  MAINNET: "mainnet",
  TESTNET: "testnet"
} as const;

export type NetworkType = typeof NETWORK_TYPES[keyof typeof NETWORK_TYPES];

export const WALLET_TYPES = {
  BITCOIN: "Bitcoin",
  MINTLAYER: "Mintlayer"
} as const;

export type WalletType = typeof WALLET_TYPES[keyof typeof WALLET_TYPES];

export const TRANSACTION_MODES = {
  TRANSACTION: "transaction",
  DELEGATION: "delegation",
  STAKING: "staking",
  WITHDRAW: "withdraw",
  NFT: "nft"
} as const;

export type TransactionMode = typeof TRANSACTION_MODES[keyof typeof TRANSACTION_MODES];

export const EXTENSION_EVENTS = {
  INIT_REQUEST: "InitWalletRequest",
  INIT_RESPONSE: "InitWalletResponse"
} as const;

export const MESSAGE_TYPES = {
  CONNECT: "connect",
  DELEGATE: "delegate",
  STAKE: "stake",
  VERSION: "version"
} as const;

export const ERROR_TYPES = {
  EXTENSION_NOT_FOUND: "EXTENSION_NOT_FOUND",
  CONNECTION_FAILED: "CONNECTION_FAILED",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_PARAMS: "INVALID_PARAMS",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  INVALID_RESPONSE: "INVALID_RESPONSE"
} as const;

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES]; 