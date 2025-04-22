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

export interface SignTransactionResponse {
  signedTx: string
}

export interface TransferParams {
  to: string
  amount: number
  token_id?: string
  number_of_decimals?: number
}

export interface TransferResponse {
  txId: string
}

export interface DelegateParams {
  poolId: string
  amount: number
}

export interface DelegateResponse {
  txId: string
}

export interface IssueTokenParams {
  authority: string
  is_freezable: boolean
  metadata_uri: string
  number_of_decimals: number
  token_ticker: string
  supply_type: "Unlimited" | "Lockable" | "Fixed"
  supply_amount?: number
}

export interface IssueTokenResponse {
  tokenId: string
}

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

export interface MintTokenResponse {
  txId: string
}

export interface UnmintTokenParams {
  amount: number
  token_id: string
  token_details: {
    number_of_decimals: number
    next_nonce: number
    authority: string
  }
}

export interface UnmintTokenResponse {
  txId: string
}

export interface LockTokenSupplyParams {
  token_id: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export interface LockTokenSupplyResponse {
  txId: string
}

export interface ChangeTokenAuthorityParams {
  token_id: string
  new_authority: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export interface ChangeTokenAuthorityResponse {
  txId: string
}

export interface ChangeMetadataUriParams {
  token_id: string
  new_metadata_uri: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export interface ChangeMetadataUriResponse {
  txId: string
}

export interface CreateOrderParams {
  ask_amount: number
  ask_token: string
  give_amount: number
  give_token: string
  conclude_destination: string
}

export interface CreateOrderResponse {
  orderId: string
}

export interface FillOrderParams {
  order_id: string
  amount: number
  destination: string
  order_details: {
    nonce: number
  }
}

export interface FillOrderResponse {
  txId: string
}

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

export interface ConcludeOrderResponse {
  txId: string
}

export interface BridgeParams {
  destination: string
  amount: number
  token_id?: string
  intent: string
}

export interface BridgeResponse {
  txId: string
}

export interface GetXPubResponse {
  xpub: string
}

export interface FetchOrderDetailsParams {
  order_id: string
}

export interface FetchOrderDetailsResponse {
  order: Order
}

export interface BroadcastTxParams {
  tx: string
}

export interface BroadcastTxResponse {
  txId: string
}

export interface BurnParams {
  token_id: string
  amount: number
  token_details?: {
    number_of_decimals: number
  }
}

export interface BurnResponse {
  txId: string
}

export interface FreezeTokenParams {
  token_id: string
  is_unfreezable: boolean
  token_details: {
    next_nonce: number
    authority: string
  }
}

export interface FreezeTokenResponse {
  txId: string
}

export interface UnfreezeTokenParams {
  token_id: string
  token_details: {
    next_nonce: number
    authority: string
  }
}

export interface UnfreezeTokenResponse {
  txId: string
}

export interface DataDepositParams {
  data: any
}

export interface DataDepositResponse {
  txId: string
}
