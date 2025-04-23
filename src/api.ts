import {
  BlockInfo,
  BlockHeader,
  BlockHeight,
  BlockTimestamp,
  TransactionOutput,
  PaginationParams,
  Transaction,
  AddressInfo,
  UtxoOutPoint,
  DelegationInfo,
  PoolInfo,
  TokenInfo,
  NFTInfo,
  OrderInfo,
  TimeFilter,
  Amount,
} from "./index.d"

export class MintlayerAPIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async fetch<T>(path: string, options: RequestInit = {}, params?: Record<string, any>): Promise<T> {
    let url = `${this.baseURL}${path}`

    if (params) {
      const queryString = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryString.append(key, String(value))
        }
      })
      url += `?${queryString.toString()}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`)
      }
      throw new Error("API request failed with unknown error")
    }
  }

  // Chain endpoints
  async getChainGenesis(): Promise<{
    block_id: string
    genesis_message: string
    timestamp: BlockTimestamp
    utxos: TransactionOutput[]
  }> {
    return this.fetch("/chain/genesis")
  }

  async getChainTip(): Promise<{
    block_height: BlockHeight
    block_id: string
  }> {
    return this.fetch("/chain/tip")
  }

  async getChainAtHeight(height: string): Promise<string> {
    return this.fetch(`/chain/${height}`)
  }

  // Block endpoints
  async getBlock(id: string): Promise<BlockInfo> {
    return this.fetch(`/block/${id}`)
  }

  async getBlockHeader(id: string): Promise<BlockHeader> {
    return this.fetch(`/block/${id}/header`)
  }

  async getBlockReward(id: string): Promise<TransactionOutput[]> {
    return this.fetch(`/block/${id}/reward`)
  }

  async getBlockTransactionIds(id: string): Promise<string[]> {
    return this.fetch(`/block/${id}/transaction-ids`)
  }

  // Transaction endpoints
  async submitTransaction(transaction: string): Promise<{ tx_id: string }> {
    return this.fetch("/transaction", {
      method: "POST",
      body: transaction,
    })
  }

  async getFeerate(params?: { in_top_x_mb?: number }): Promise<string> {
    return this.fetch("/feerate", {}, params)
  }

  async getTransactions(params?: PaginationParams): Promise<Transaction[]> {
    return this.fetch("/transaction", {}, params)
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.fetch(`/transaction/${id}`)
  }

  async getTransactionMerklePath(id: string): Promise<{
    block_id: string
    transaction_index: number
    merkle_root: string
    merkle_path: string[]
  }> {
    return this.fetch(`/transaction/${id}/merkle-path`)
  }

  // Address endpoints
  async getAddress(address: string): Promise<AddressInfo> {
    return this.fetch(`/address/${address}`)
  }

  async getAllAddressUtxos(address: string): Promise<
    {
      outpoint: UtxoOutPoint
      utxo: TransactionOutput
    }[]
  > {
    return this.fetch(`/address/${address}/all-utxos`)
  }

  async getAddressUtxos(address: string): Promise<
    {
      outpoint: UtxoOutPoint
      utxo: TransactionOutput
    }[]
  > {
    return this.fetch(`/address/${address}/spendable-utxos`)
  }

  async getAddressDelegations(address: string): Promise<DelegationInfo[]> {
    return this.fetch(`/address/${address}/delegations`)
  }

  async getAddressTokenAuthority(address: string): Promise<string[]> {
    return this.fetch(`/address/${address}/token-authority`)
  }

  // Pool endpoints
  async getPools(params?: PaginationParams & { sort?: "by_height" | "by_pledge" }): Promise<PoolInfo[]> {
    return this.fetch("/pool", {}, params)
  }

  async getPool(id: string): Promise<PoolInfo> {
    return this.fetch(`/pool/${id}`)
  }

  async getPoolBlockStats(
    id: string,
    timeFilter: TimeFilter,
  ): Promise<{
    block_count: number
  }> {
    return this.fetch(`/pool/${id}/block-stats`, {}, timeFilter)
  }

  async getPoolDelegations(id: string): Promise<DelegationInfo[]> {
    return this.fetch(`/pool/${id}/delegations`)
  }

  // Delegation endpoints
  async getDelegation(id: string): Promise<DelegationInfo> {
    return this.fetch(`/delegation/${id}`)
  }

  // Token endpoints
  async getToken(id: string): Promise<TokenInfo> {
    return this.fetch(`/token/${id}`)
  }

  async getNFT(id: string): Promise<NFTInfo> {
    return this.fetch(`/nft/${id}`)
  }

  async getTokenIds(params?: PaginationParams): Promise<string[]> {
    return this.fetch("/token", {}, params)
  }

  async getTokenIdsByTicker(ticker: string, params?: PaginationParams): Promise<string[]> {
    return this.fetch(`/token/ticker/${ticker}`, {}, params)
  }

  // Statistics endpoints
  async getCoinStatistics(): Promise<{
    circulating_supply: Amount
    preminted: Amount
    burned: Amount
    staked: Amount
  }> {
    return this.fetch("/statistics/coin")
  }

  async getTokenStatistics(tokenId: string): Promise<{
    circulating_supply: Amount
    preminted: Amount
    burned: Amount
    staked: Amount
  }> {
    return this.fetch(`/statistics/token/${tokenId}`)
  }

  // Order endpoints
  async getOrders(params?: PaginationParams): Promise<OrderInfo[]> {
    return this.fetch("/order", {}, params)
  }

  async getOrder(id: string): Promise<OrderInfo> {
    return this.fetch(`/order/${id}`)
  }

  async getOrderPair(pair: string, params?: PaginationParams): Promise<OrderInfo[]> {
    return this.fetch(`/order/pair/${pair}`, {}, params)
  }
}
