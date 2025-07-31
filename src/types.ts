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

export interface CheckConnectionResponse {
  isConnected: boolean
  address: AccountAddresses
}

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

export type TransferNftParams = Parameters<Client["transferNft"]>[0]

export type TransferNftResponse = SignTransactionResponse

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
  coin_balance: AmountWithAtoms
  locked_coin_balance: AmountWithAtoms
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
  additional_metadata_uri?: { hex?: string; string: string }
  creator?: { hex?: string; string: string }
  description: { hex?: string; string: string }
  icon_uri?: { hex?: string; string: string }
  media_hash: { hex?: string; string: string }
  media_uri?: { hex?: string; string: string }
  name: { hex?: string; string: string }
  owner: { hex?: string; string: string }
  ticker: { hex?: string; string: string }
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

// HTLC (Hash Time-Locked Contract) Types
export interface HtlcOutput {
  destination: string
  value: Amount
  token_id?: string
  hash_lock: string
  timelock: Timelock
}

export interface Timelock {
  block_height?: number
  timestamp?: number
}

export interface CreateHtlcArgs {
  destination: string
  value: Amount
  token_id?: string
  hash_lock: string
  timelock: Timelock
}

export interface ExtractHtlcSecretArgs {
  htlc_output: HtlcOutput
  secret: string
}

export interface RefundHtlcArgs {
  htlc_output: HtlcOutput
}

// HTLC Type Aliases
export type CreateHtlcParams = Parameters<Client["createHtlc"]>[0]
export type CreateHtlcResponse = SignTransactionResponse

export type ExtractHtlcSecretParams = Parameters<Client["extractHtlcSecret"]>[0]
export type ExtractHtlcSecretResponse = SignTransactionResponse

export type RefundHtlcParams = Parameters<Client["refundHtlc"]>[0]
export type RefundHtlcResponse = SignTransactionResponse

// Challenge Signing Types
export interface SignChallengeArgs {
  message: string
  encoding?: "utf8" | "hex"
}

export interface SignChallengeResponse {
  signature: string
  public_key: string
}

// Challenge Signing Type Aliases
export type SignChallengeParams = Parameters<Client["signChallenge"]>[0]

// Custom Signer Types
export interface AccountProvider {
  getAddresses(): Promise<AccountAddresses>
  signTransaction(transaction: string): Promise<string>
  signChallenge(message: string, encoding?: "utf8" | "hex"): Promise<{ signature: string; public_key: string }>
}

export interface CustomSignerParams {
  accountProvider: AccountProvider
  network: Network
}

// Custom Signer Type Aliases
// Note: Custom signer functionality may be implemented differently in the underlying SDK

// UTXO Preview Types
export interface PreviewUtxoChangeArgs {
  transaction: string
  addresses: string[]
}

export interface PreviewUtxoChangeResponse {
  spent: any[] // UtxoEntry[] from SDK
  created: any[] // UtxoEntry[] from SDK
}

export interface DecorateWithUtxoFetchArgs {
  transaction: string
  addresses: string[]
}

// UTXO Preview Type Aliases
export type PreviewUtxoChangeParams = Parameters<Client["previewUtxoChange"]>[0]
export type DecorateWithUtxoFetchParams = Parameters<Client["decorateWithUtxoFetch"]>[0]

// Bitcoin Wallet Types
export interface BTCCredentialsResponse {
  btcAddress: string
  btcPublicKey: string
}

export interface BTCHTLCCreateRequest {
  amount: string // Amount in satoshis
  secretHash: string // Secret hash in hex format
  recipientPublicKey: string // Public key of who can claim with secret
  refundPublicKey: string // Public key of who can refund after timeout
  timeoutBlocks: number // Number of BTC blocks for timeout
}

export interface BTCHTLCSpendRequest {
  type: "spendHtlc" // Fixed type identifier
  utxo: any // UTXO data from blockchain API
  redeemScriptHex: string // Redeem script from HTLC creation
  to: string // Destination address
  secret: string // Secret to reveal (hex format)
}

export interface BTCHTLCRefundRequest {
  type: "refundHtlc" // Fixed type identifier
  utxo: any // UTXO data from blockchain API
  redeemScriptHex: string // Redeem script from HTLC creation
  to: string // Destination address
}

export interface BTCTransactionResponse {
  signedTxHex: string // Signed transaction ready to broadcast
  transactionId: string // Transaction ID
}

export interface BTCHTLCCreateResponse {
  signedTxHex: string // Signed transaction ready to broadcast
  transactionId: string // Transaction ID of the funding transaction
  htlcAddress: string // Generated HTLC contract address
  redeemScript: string // Redeem script for spending operations
}

// Bitcoin Request Parameters
export interface GetBTCCredentialsParams {
  items: ["btcAddress", "btcPublicKey"]
}

export interface CreateBTCHTLCParams {
  chain: "bitcoin"
  txData: {
    JSONRepresentation: BTCHTLCCreateRequest
  }
}

export interface SpendBTCHTLCParams {
  chain: "bitcoin"
  txData: {
    JSONRepresentation: BTCHTLCSpendRequest
  }
}

export interface RefundBTCHTLCParams {
  chain: "bitcoin"
  txData: {
    JSONRepresentation: BTCHTLCRefundRequest
  }
}
