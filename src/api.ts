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
  NFTInfo,
  OrderInfo,
  TimeFilter,
  Amount,
  TokenDetails,
  TransactionDetail,
} from "./types"

/**
 * Client for interacting with the Mintlayer API
 * Provides methods to interact with various endpoints of the Mintlayer blockchain
 * including chain, block, transaction, address, pool, delegation, token, and order operations
 */
export class MintlayerAPIClient {
  private baseURL: string

  /**
   * Creates a new instance of the Mintlayer API client
   * @param baseURL - The base URL of the Mintlayer API server
   */
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Internal method to make HTTP requests to the API
   * @param path - The API endpoint path
   * @param options - Request options including method, headers, and body
   * @param params - Query parameters to be appended to the URL
   * @returns Promise resolving to the response data
   * @throws Error if the request fails or returns a non-200 status code
   */
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

  /**
   * Fetches the genesis block information
   * @returns Promise resolving to the genesis block data including block ID, message, timestamp, and UTXOs
   */
  async getChainGenesis(): Promise<{
    block_id: string
    genesis_message: string
    timestamp: BlockTimestamp
    utxos: TransactionOutput[]
  }> {
    return this.fetch("/chain/genesis")
  }

  /**
   * Fetches the current chain tip information
   * @returns Promise resolving to the current block height and block ID
   */
  async getChainTip(): Promise<{
    block_height: BlockHeight
    block_id: string
  }> {
    return this.fetch("/chain/tip")
  }

  /**
   * Fetches the block ID at a specific height
   * @param height - The block height to query
   * @returns Promise resolving to the block ID at the specified height
   */
  async getChainAtHeight(height: string): Promise<string> {
    return this.fetch(`/chain/${height}`)
  }

  /**
   * Fetches detailed information about a specific block
   * @param id - The block ID to query
   * @returns Promise resolving to the block information
   */
  async getBlock(id: string): Promise<BlockInfo> {
    return this.fetch(`/block/${id}`)
  }

  /**
   * Fetches the header information for a specific block
   * @param id - The block ID to query
   * @returns Promise resolving to the block header information
   */
  async getBlockHeader(id: string): Promise<BlockHeader> {
    return this.fetch(`/block/${id}/header`)
  }

  /**
   * Fetches the reward information for a specific block
   * @param id - The block ID to query
   * @returns Promise resolving to the block reward transaction outputs
   */
  async getBlockReward(id: string): Promise<TransactionOutput[]> {
    return this.fetch(`/block/${id}/reward`)
  }

  /**
   * Fetches the list of transaction IDs in a specific block
   * @param id - The block ID to query
   * @returns Promise resolving to an array of transaction IDs
   */
  async getBlockTransactionIds(id: string): Promise<string[]> {
    return this.fetch(`/block/${id}/transaction-ids`)
  }

  /**
   * Submits a new transaction to the network
   * @param transaction - The transaction data to submit
   * @returns Promise resolving to the transaction ID
   */
  async submitTransaction(transaction: string): Promise<{ tx_id: string }> {
    return this.fetch("/transaction", {
      method: "POST",
      body: transaction,
    })
  }

  /**
   * Fetches the current fee rate
   * @param params - Optional parameters including in_top_x_mb for fee rate calculation
   * @returns Promise resolving to the current fee rate
   */
  async getFeerate(params?: { in_top_x_mb?: number }): Promise<string> {
    return this.fetch("/feerate", {}, params)
  }

  /**
   * Fetches a list of transactions with optional pagination
   * @param params - Optional pagination parameters
   * @returns Promise resolving to an array of transactions
   */
  async getTransactions(params?: PaginationParams): Promise<Transaction[]> {
    return this.fetch("/transaction", {}, params)
  }

  /**
   * Fetches detailed information about a specific transaction
   * @param id - The transaction ID to query
   * @returns Promise resolving to the transaction information
   */
  async getTransaction(id: string): Promise<TransactionDetail> {
    return this.fetch(`/transaction/${id}`)
  }

  /**
   * Fetches the Merkle path for a specific transaction
   * @param id - The transaction ID to query
   * @returns Promise resolving to the transaction's Merkle path information
   */
  async getTransactionMerklePath(id: string): Promise<{
    block_id: string
    transaction_index: number
    merkle_root: string
    merkle_path: string[]
  }> {
    return this.fetch(`/transaction/${id}/merkle-path`)
  }

  /**
   * Fetches information about a specific address
   * @param address - The address to query
   * @returns Promise resolving to the address information
   */
  async getAddress(address: string): Promise<AddressInfo> {
    return this.fetch(`/address/${address}`)
  }

  /**
   * Fetches all UTXOs for a specific address
   * @param address - The address to query
   * @returns Promise resolving to an array of UTXO information
   */
  async getAllAddressUtxos(address: string): Promise<
    {
      outpoint: UtxoOutPoint
      utxo: TransactionOutput
    }[]
  > {
    return this.fetch(`/address/${address}/all-utxos`)
  }

  /**
   * Fetches spendable UTXOs for a specific address
   * @param address - The address to query
   * @returns Promise resolving to an array of spendable UTXO information
   */
  async getAddressUtxos(address: string): Promise<
    {
      outpoint: UtxoOutPoint
      utxo: TransactionOutput
    }[]
  > {
    return this.fetch(`/address/${address}/spendable-utxos`)
  }

  /**
   * Fetches delegation information for a specific address
   * @param address - The address to query
   * @returns Promise resolving to an array of delegation information
   */
  async getAddressDelegations(address: string): Promise<DelegationInfo[]> {
    return this.fetch(`/address/${address}/delegations`)
  }

  /**
   * Fetches token authority information for a specific address
   * @param address - The address to query
   * @returns Promise resolving to an array of token authority IDs
   */
  async getAddressTokenAuthority(address: string): Promise<string[]> {
    return this.fetch(`/address/${address}/token-authority`)
  }

  /**
   * Fetches a list of pools with optional pagination and sorting
   * @param params - Optional parameters including pagination and sort options
   * @returns Promise resolving to an array of pool information
   */
  async getPools(params?: PaginationParams & { sort?: "by_height" | "by_pledge" }): Promise<PoolInfo[]> {
    return this.fetch("/pool", {}, params)
  }

  /**
   * Fetches information about a specific pool
   * @param id - The pool ID to query
   * @returns Promise resolving to the pool information
   */
  async getPool(id: string): Promise<PoolInfo> {
    return this.fetch(`/pool/${id}`)
  }

  /**
   * Fetches block statistics for a specific pool
   * @param id - The pool ID to query
   * @param timeFilter - Time filter parameters for the statistics
   * @returns Promise resolving to the pool's block statistics
   */
  async getPoolBlockStats(
    id: string,
    timeFilter: TimeFilter,
  ): Promise<{
    block_count: number
  }> {
    return this.fetch(`/pool/${id}/block-stats`, {}, timeFilter)
  }

  /**
   * Fetches delegation information for a specific pool
   * @param id - The pool ID to query
   * @returns Promise resolving to an array of delegation information
   */
  async getPoolDelegations(id: string): Promise<DelegationInfo[]> {
    return this.fetch(`/pool/${id}/delegations`)
  }

  /**
   * Fetches information about a specific delegation
   * @param id - The delegation ID to query
   * @returns Promise resolving to the delegation information
   */
  async getDelegation(id: string): Promise<DelegationInfo> {
    return this.fetch(`/delegation/${id}`)
  }

  /**
   * Fetches information about a specific token
   * @param id - The token ID to query
   * @returns Promise resolving to the token information
   */
  async getToken(id: string): Promise<TokenDetails> {
    return this.fetch(`/token/${id}`)
  }

  /**
   * Fetches information about a specific NFT
   * @param id - The NFT ID to query
   * @returns Promise resolving to the NFT information
   */
  async getNFT(id: string): Promise<NFTInfo> {
    return this.fetch(`/nft/${id}`)
  }

  /**
   * Fetches a list of token IDs with optional pagination
   * @param params - Optional pagination parameters
   * @returns Promise resolving to an array of token IDs
   */
  async getTokenIds(params?: PaginationParams): Promise<string[]> {
    return this.fetch("/token", {}, params)
  }

  /**
   * Fetches token IDs by their ticker symbol
   * @param ticker - The ticker symbol to search for
   * @param params - Optional pagination parameters
   * @returns Promise resolving to an array of token IDs matching the ticker
   */
  async getTokenIdsByTicker(ticker: string, params?: PaginationParams): Promise<string[]> {
    return this.fetch(`/token/ticker/${ticker}`, {}, params)
  }

  /**
   * Fetches coin statistics including supply information
   * @returns Promise resolving to coin statistics including circulating supply, preminted, burned, and staked amounts
   */
  async getCoinStatistics(): Promise<{
    circulating_supply: Amount
    preminted: Amount
    burned: Amount
    staked: Amount
  }> {
    return this.fetch("/statistics/coin")
  }

  /**
   * Fetches statistics for a specific token
   * @param tokenId - The token ID to query
   * @returns Promise resolving to token statistics including circulating supply, preminted, burned, and staked amounts
   */
  async getTokenStatistics(tokenId: string): Promise<{
    circulating_supply: Amount
    preminted: Amount
    burned: Amount
    staked: Amount
  }> {
    return this.fetch(`/statistics/token/${tokenId}`)
  }

  /**
   * Fetches a list of orders with optional pagination
   * @param params - Optional pagination parameters
   * @returns Promise resolving to an array of order information
   */
  async getOrders(params?: PaginationParams): Promise<OrderInfo[]> {
    return this.fetch("/order", {}, params)
  }

  /**
   * Fetches information about a specific order
   * @param id - The order ID to query
   * @returns Promise resolving to the order information
   */
  async getOrder(id: string): Promise<OrderInfo> {
    return this.fetch(`/order/${id}`)
  }

  /**
   * Fetches orders for a specific trading pair
   * @param pair - The trading pair to query
   * @param params - Optional pagination parameters
   * @returns Promise resolving to an array of order information for the specified pair
   */
  async getOrderPair(pair: string, params?: PaginationParams): Promise<OrderInfo[]> {
    return this.fetch(`/order/pair/${pair}`, {}, params)
  }
}
