import { Client } from "@mintlayer/sdk"

export type Network = "mainnet" | "testnet"

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "unavailable" | "auto-connecting"

export interface AddressData {
  receiving: string[]
  change: string[]
}

export interface AccountAddresses {
  mainnet: AddressData
  testnet: AddressData
}

export type SetNetworkParams = Network

export interface GetNetworkResponse {
  network: Network
}

export interface CheckConnectionSuccessPositive {
  isConnected: true
  address: AccountAddresses
}

export interface CheckConnectionSuccessNegative {
  isConnected: false
}

export interface CheckConnectionError {
  isConnected: false
  error: string
}

export type CheckConnectionResponse =
  | CheckConnectionSuccessPositive
  | CheckConnectionSuccessNegative
  | CheckConnectionError

export interface Delegation {
  balance: {
    decimal: string
    atoms: string
  }
  [key: string]: any
}

export interface TokenAuthority {
  [key: string]: any
}

export type BuildTransactionParams = Parameters<Client["buildTransaction"]>[0]

export type SignTransactionParams = Parameters<Client["signTransaction"]>[0]

export type SignTransactionResponse = string

export type TransferParams = Parameters<Client["transfer"]>[0]

export type TransferResponse = SignTransactionResponse

export type DelegateParams = Parameters<Client["delegate"]>[0]

export type DelegateResponse = SignTransactionResponse

export type IssueTokenParams = Parameters<Client["issueToken"]>[0]

export type IssueTokenResponse = SignTransactionResponse

export type MintTokenParams = Parameters<Client["mintToken"]>[0]

export type MintTokenResponse = SignTransactionResponse

export type UnmintTokenParams = Parameters<Client["unmintToken"]>[0]

export type UnmintTokenResponse = SignTransactionResponse

export type LockTokenSupplyParams = Parameters<Client["lockTokenSupply"]>[0]

export type LockTokenSupplyResponse = SignTransactionResponse

export type ChangeTokenAuthorityParams = Parameters<Client["changeTokenAuthority"]>[0]

export type ChangeTokenAuthorityResponse = SignTransactionResponse

export type ChangeMetadataUriParams = Parameters<Client["changeMetadataUri"]>[0]

export type ChangeMetadataUriResponse = SignTransactionResponse

export type CreateOrderParams = Parameters<Client["createOrder"]>[0]

export type CreateOrderResponse = SignTransactionResponse

export type FillOrderParams = Parameters<Client["fillOrder"]>[0]

export type FillOrderResponse = SignTransactionResponse

export type ConcludeOrderParams = Parameters<Client["concludeOrder"]>[0]

export type ConcludeOrderResponse = SignTransactionResponse

export type BridgeParams = Parameters<Client["bridgeRequest"]>[0]

export type BridgeResponse = SignTransactionResponse

export interface GetXPubResponse {
  xpub: string
  order: OrderDetails
}

export type BroadcastTxParams = Parameters<Client["broadcastTx"]>[0]

export interface BroadcastTxResponse {
  tx_id: string
}

export type BurnParams = Parameters<Client["burn"]>[0]

export type BurnResponse = SignTransactionResponse

export type FreezeTokenParams = Parameters<Client["freezeToken"]>[0]

export type FreezeTokenResponse = SignTransactionResponse

export type UnfreezeTokenParams = Parameters<Client["unfreezeToken"]>[0]

export type UnfreezeTokenResponse = SignTransactionResponse

export type DataDepositParams = Parameters<Client["dataDeposit"]>[0]

export type DataDepositResponse = SignTransactionResponse

export type BlockHeight = number
export type BlockTimestamp = number
export type Amount = string
export type AmountWithAtoms = {
  atoms: string
  decimal: string
}
export type AccountNonce = number
export type PerThousand = number

export interface BlockInfo {
  block: BlockWithExtraData
  height: BlockHeight | null
}

export interface BlockWithExtraData {
  block: Block
  block_reward: BlockReward
  transactions: Transaction[]
}

export interface Block {
  header: BlockHeader
  body: BlockBody
}

export interface BlockHeader {
  version: number
  previous_block_id: string
  merkle_root: string
  timestamp: BlockTimestamp
  height: BlockHeight
  block_reward: BlockReward
}

export interface BlockBody {
  transactions: Transaction[]
}

export interface BlockReward {
  outputs: TransactionOutput[]
}

export interface TransactionDetail {
  block_id: string
  confirmations: string
  fee: {
    atoms: string
    decimal: string
  }
  flags: number
  id: string
  inputs: {
    input: {
      index: number
      input_type: string
      source_id: string
      source_type: string
      order_id?: string
      command?: string
      token_id?: string
      amount?: {
        atoms: string
        decimal: string
      }
    }
    utxo: {
      destination: string
      type: string
      value: {
        amount: {
          atoms: string
          decimal: string
        }
        type: string
        token_id?: string
      }
    }
  }[]
  is_replaceable: boolean
  outputs: {
    destination?: string
    type: string
    value?: {
      amount: {
        atoms: string
        decimal: string
      }
      type: string
      token_id?: string
    }
    data?: {
      name?: {
        hex: string
        string: string
      }
      description?: {
        hex: string
        string: string
      }
      icon_uri?: {
        hex: string
        string: string
      }
      media_uri?: {
        hex: string
        string: string
      }
      media_hash?: {
        hex: string
        string: string
      }
      additional_metadata_uri?: {
        hex: string
        string: string
      }
      creator?: {
        hex: string
        string: string
      }
      ticker?: {
        hex: string
        string: string
      }
    }
    token_ticker?: {
      hex: string
      string: string
    }
    token_id?: string
    pool_id?: string
    order_id?: string
    authority?: string
    is_freezable?: boolean
    metadata_uri?: {
      hex: string
      string: string
    }
    number_of_decimals?: number
    total_supply?: {
      type: string
      content?: {
        atoms: string
        decimal: string
      }
    }
  }[]
  timestamp: string
  version_byte: number
}

export interface Transaction {
  id: string
  inputs: TransactionInput[]
  outputs: TransactionOutput[]
}

export interface TransactionInput {
  outpoint: UtxoOutPoint
  signature: string
}

export interface TransactionOutput {
  destination: string
  value: Amount
  token_id?: string
}

export interface UtxoOutPoint {
  tx_id: string
  output_index: number
}

export interface AddressInfo {
  coin_balance: Amount
  locked_coin_balance: Amount
  transaction_history: string[]
  tokens: TokenBalance[]
}

export interface TokenBalance {
  token_id: string
  amount: AmountWithAtoms
}

export interface PoolInfo {
  pool_id: string
  pledge: Amount
  balance: Amount
  height: BlockHeight
  block_timestamp: BlockTimestamp
  vrf_public_key: string
  decommission_key: string
  staker: string
  margin_ratio_per_thousand: PerThousand
  cost_per_block: Amount
}

export interface DelegationInfo {
  delegation_id: string
  pool_id: string
  balance: Amount
  spend_destination: string
  next_nonce: AccountNonce
  creation_block_height: BlockHeight
}

export interface TokenDetails {
  token_ticker: {
    string: string
    hex: string
  }
  token_id: string
  pool_id: string
  order_id: string
  authority: string
  is_token_freezable: boolean
  is_token_unfreezable: boolean
  is_locked: boolean
  frozen: boolean
  next_nonce: number
  metadata_uri: {
    hex: string
    string: string
  }
  number_of_decimals: number
  circulating_supply: {
    atoms: string
    decimal: string
  }
  total_supply: "Unlimited" | { Fixed: { atoms: string } }
}

export interface NFTInfo {
  id: string
  owner: string
  metadata: NFTMetadata
}

export interface NFTMetadata {
  media_hash: string
  name: string
  description: string
  ticker: string
  creator?: string
  icon_uri?: string
  media_uri?: string
  additional_metadata_uri?: string
}

export interface OrderDetails {
  order_id: string
  nonce: number
  conclude_destination: string
  ask_currency: { type: "Coin" } | { type: "Token"; token_id: string }
  give_currency: { type: "Coin" } | { type: "Token"; token_id: string }
  ask_balance: { atoms: string; decimal: string }
  give_balance: { atoms: string; decimal: string }
}

export interface TimeFilter {
  from: number
  to: number
}

export interface PaginationParams {
  offset?: number
  items?: number
}

export type IssueNftParams = Parameters<Client["issueNft"]>[0]

export type IssueNftResponse = SignTransactionResponse
