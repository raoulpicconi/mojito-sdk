declare global {
  interface Window {
    mintlayer?: MintlayerClient
  }
}

export interface MintlayerClient {
  isMintlayer: boolean
  setNetwork: (params: SetNetworkParams) => void
  getNetwork: () => GetNetworkResponse
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  request: <T = unknown>(params: RequestParams) => Promise<T>
  getAddresses: () => Promise<string[]>
  getBalance: () => Promise<number>
  getDelegations: () => Promise<Delegation[]>
  getTokensOwned: () => Promise<TokenAuthority[]>
  getDelegationsTotal: () => Promise<number>
  buildTransaction: (params: BuildTransactionParams) => Promise<BuildTransactionResponse>
  signTransaction: (params: SignTransactionParams) => Promise<SignTransactionResponse>
  transfer: (params: TransferParams) => Promise<TransferResponse>
  delegate: (params: DelegateParams) => Promise<DelegateResponse>
  issueToken: (params: IssueTokenParams) => Promise<IssueTokenResponse>
  mintToken: (params: MintTokenParams) => Promise<MintTokenResponse>
  unmintToken: (params: UnmintTokenParams) => Promise<UnmintTokenResponse>
  lockTokenSupply: (params: LockTokenSupplyParams) => Promise<LockTokenSupplyResponse>
  changeTokenAuthority: (params: ChangeTokenAuthorityParams) => Promise<ChangeTokenAuthorityResponse>
  changeMetadataUri: (params: ChangeMetadataUriParams) => Promise<ChangeMetadataUriResponse>
  createOrder: (params: CreateOrderParams) => Promise<CreateOrderResponse>
  fillOrder: (params: FillOrderParams) => Promise<FillOrderResponse>
  getAccountOrders: () => Promise<Order[]>
  concludeOrder: (params: ConcludeOrderParams) => Promise<ConcludeOrderResponse>
  bridgeRequest: (params: BridgeParams) => Promise<BridgeResponse>
  getXPub: () => Promise<GetXPubResponse>
  on: (eventName: string, callback: (data: any) => void) => void
  getAvailableOrders: () => Promise<Order[]>
  fetchOrderDetails: (params: FetchOrderDetailsParams) => Promise<FetchOrderDetailsResponse>
  broadcastTx: (params: BroadcastTxParams) => Promise<BroadcastTxResponse>
  burn: (params: BurnParams) => Promise<BurnResponse>
  freezeToken: (params: FreezeTokenParams) => Promise<FreezeTokenResponse>
  unfreezeToken: (params: UnfreezeTokenParams) => Promise<UnfreezeTokenResponse>
  dataDeposit: (params: DataDepositParams) => Promise<DataDepositResponse>
}

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

export interface SetNetworkParams {
  network: Network
}

export interface GetNetworkResponse {
  network: Network
}

export interface CheckConnectionSuccess {
  isConnected: true
  address: AccountAddresses
}

export interface CheckConnectionError {
  isConnected: false
  error: string
}

export type CheckConnectionResponse = CheckConnectionSuccess | CheckConnectionError

export interface RequestParams {
  method: string
  params?: Record<string, any>
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

export interface BuildTransactionParams {
  type: TransactionType
  params: Record<string, any>
}

export type TransactionType =
  | "Transfer"
  | "BurnToken"
  | "IssueFungibleToken"
  | "MintToken"
  | "UnmintToken"
  | "LockTokenSupply"
  | "ChangeTokenAuthority"
  | "ChangeMetadataUri"
  | "FreezeToken"
  | "UnfreezeToken"
  | "DataDeposit"
  | "CreateOrder"
  | "ConcludeOrder"
  | "FillOrder"

export interface BuildTransactionResponse {
  JSONRepresentation: {
    inputs: any[]
    outputs: any[]
  }
  BINRepresentation: any
  HEXRepresentation_unsigned: any
}

export interface SignTransactionParams {
  JSONRepresentation: any
  BINRepresentation?: any
  HEXRepresentation_unsigned?: any
}

export type SignTransactionResponse = string

export interface TransferParams {
  to: string
  amount: number
  token_id?: string
  number_of_decimals?: number
}

export type TransferResponse = SignTransactionResponse

export interface DelegateParams {
  poolId: string
  amount: number
}

export type DelegateResponse = SignTransactionResponse

export interface IssueTokenParams {
  authority: string
  is_freezable: boolean
  metadata_uri: string
  number_of_decimals: number
  token_ticker: string
  supply_type: "Unlimited" | "Lockable" | "Fixed"
  supply_amount?: number
}

export type IssueTokenResponse = SignTransactionResponse

export interface MintTokenParams {
  destination: string
  amount: number
  token_id: string
  token_details: {
    number_of_decimals: number
    next_nonce: number
    authority: string
  }
}

export type MintTokenResponse = SignTransactionResponse

export interface UnmintTokenParams {
  amount: number
  token_id: string
  token_details: {
    number_of_decimals: number
    next_nonce: number
    authority: string
  }
}

export type UnmintTokenResponse = SignTransactionResponse

export interface LockTokenSupplyParams {
  token_id: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export type LockTokenSupplyResponse = SignTransactionResponse

export interface ChangeTokenAuthorityParams {
  token_id: string
  new_authority: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export type ChangeTokenAuthorityResponse = SignTransactionResponse

export interface ChangeMetadataUriParams {
  token_id: string
  new_metadata_uri: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export type ChangeMetadataUriResponse = SignTransactionResponse

export interface CreateOrderParams {
  ask_amount: number
  ask_token: string
  give_amount: number
  give_token: string
  conclude_destination: string
}

export type CreateOrderResponse = SignTransactionResponse

export interface FillOrderParams {
  order_id: string
  amount: number
  destination: string
  order_details: {
    nonce: number
  }
}

export type FillOrderResponse = SignTransactionResponse

export interface Order {
  order_id: string
  ask_currency: string | { token_id: string }
  give_currency: string | { token_id: string }
  ask_amount: number
  give_amount: number
  conclude_destination: string
}

export interface ConcludeOrderParams {
  order_id: string
}

export type ConcludeOrderResponse = SignTransactionResponse

export interface BridgeParams {
  destination: string
  amount: number
  token_id?: string
  intent: string
}

export type BridgeResponse = SignTransactionResponse

export interface GetXPubResponse {
  xpub: string
}

export interface FetchOrderDetailsParams {
  order_id: string
}

export interface FetchOrderDetailsResponse {
  order: Order
}

export type BroadcastTxParams = string

export interface BroadcastTxResponse {
  tx_id: string
}

export interface BurnParams {
  token_id: string
  amount: number
  token_details?: {
    number_of_decimals: number
  }
}

export type BurnResponse = SignTransactionResponse

export interface FreezeTokenParams {
  token_id: string
  is_unfreezable: boolean
  token_details: {
    next_nonce: number
    authority: string
  }
}

export type FreezeTokenResponse = SignTransactionResponse

export interface UnfreezeTokenParams {
  token_id: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export type UnfreezeTokenResponse = SignTransactionResponse

export interface DataDepositParams {
  data: any
}

export type DataDepositResponse = SignTransactionResponse

export type BlockHeight = number
export type BlockTimestamp = number
export type Amount = string
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
  amount: Amount
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
