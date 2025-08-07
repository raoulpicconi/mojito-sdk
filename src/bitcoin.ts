import { Client } from "@mintlayer/sdk"
import {
  BTCCredentialsResponse,
  BTCHTLCCreateRequest,
  BTCHTLCSpendRequest,
  BTCHTLCRefundRequest,
  BTCHTLCCreateResponse,
  BTCTransactionResponse,
  GetBTCCredentialsParams,
  CreateBTCHTLCParams,
  SpendBTCHTLCParams,
  RefundBTCHTLCParams,
  BTCUTXO,
  BTCBalance,
  BTCBalanceResponse,
} from "./types"

/**
 * Get Bitcoin credentials (address and public key) from the wallet
 * @param client - The Mintlayer client instance
 * @returns Promise resolving to BTC address and public key
 * @throws Error if wallet is not connected or doesn't support Bitcoin operations
 */
export async function getBTCCredentials(client: Client): Promise<BTCCredentialsResponse> {
  try {
    const response = await (client as any).request({
      method: "getData",
      params: {
        items: ["btcAddress", "btcPublicKey"],
      } as GetBTCCredentialsParams,
    })

    if (!response.btcAddress || !response.btcPublicKey) {
      throw new Error("Invalid BTC credentials response from wallet")
    }

    return response as BTCCredentialsResponse
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("wallet not connected")) {
        throw new Error("Please connect your Bitcoin wallet first")
      } else if (error.message.includes("method not supported")) {
        throw new Error("Your wallet does not support Bitcoin operations")
      }
    }
    throw new Error(`Failed to get BTC credentials: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Create a Bitcoin HTLC transaction
 * @param client - The Mintlayer client instance
 * @param request - HTLC creation parameters
 * @returns Promise resolving to signed transaction and HTLC details
 * @throws Error if transaction creation fails
 */
export async function createBTCHTLC(client: Client, request: BTCHTLCCreateRequest): Promise<BTCHTLCCreateResponse> {
  try {
    // Validate request parameters
    if (!request.amount || !request.secretHash || !request.recipientPublicKey || !request.refundPublicKey) {
      throw new Error("Missing required HTLC creation parameters")
    }

    if (request.timeoutBlocks <= 0) {
      throw new Error("Timeout blocks must be greater than 0")
    }

    const response = await (client as any).request({
      method: "signTransaction",
      params: {
        chain: "bitcoin",
        txData: {
          JSONRepresentation: request,
        },
      } as CreateBTCHTLCParams,
    })

    if (!response.signedTxHex || !response.transactionId || !response.htlcAddress || !response.redeemScript) {
      throw new Error("Invalid HTLC creation response from wallet")
    }

    return response as BTCHTLCCreateResponse
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("insufficient funds")) {
        throw new Error("Insufficient Bitcoin balance for HTLC creation")
      } else if (error.message.includes("invalid address")) {
        throw new Error("Invalid Bitcoin address provided")
      }
    }
    throw new Error(`Failed to create BTC HTLC: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Spend (claim) a Bitcoin HTLC by revealing the secret
 * @param client - The Mintlayer client instance
 * @param request - HTLC spend parameters
 * @returns Promise resolving to signed claim transaction
 * @throws Error if HTLC spending fails
 */
export async function spendBTCHTLC(client: Client, request: BTCHTLCSpendRequest): Promise<BTCTransactionResponse> {
  try {
    // Validate request parameters
    if (!request.utxo || !request.redeemScriptHex || !request.to || !request.secret) {
      throw new Error("Missing required HTLC spend parameters")
    }

    const response = await (client as any).request({
      method: "signTransaction",
      params: {
        chain: "bitcoin",
        txData: {
          JSONRepresentation: request,
        },
      } as SpendBTCHTLCParams,
    })

    if (!response.signedTxHex || !response.transactionId) {
      throw new Error("Invalid HTLC spend response from wallet")
    }

    return response as BTCTransactionResponse
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("utxo not found")) {
        throw new Error("HTLC UTXO not found on blockchain")
      } else if (error.message.includes("invalid secret")) {
        throw new Error("Invalid secret provided for HTLC claim")
      }
    }
    throw new Error(`Failed to spend BTC HTLC: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Refund a Bitcoin HTLC after the timeout period
 * @param client - The Mintlayer client instance
 * @param request - HTLC refund parameters
 * @returns Promise resolving to signed refund transaction
 * @throws Error if HTLC refund fails
 */
export async function refundBTCHTLC(client: Client, request: BTCHTLCRefundRequest): Promise<BTCTransactionResponse> {
  try {
    // Validate request parameters
    if (!request.utxo || !request.redeemScriptHex || !request.to) {
      throw new Error("Missing required HTLC refund parameters")
    }

    const response = await (client as any).request({
      method: "signTransaction",
      params: {
        chain: "bitcoin",
        txData: {
          JSONRepresentation: request,
        },
      } as RefundBTCHTLCParams,
    })

    if (!response.signedTxHex || !response.transactionId) {
      throw new Error("Invalid HTLC refund response from wallet")
    }

    return response as BTCTransactionResponse
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("timeout not reached")) {
        throw new Error("Cannot refund HTLC before timeout period")
      } else if (error.message.includes("utxo not found")) {
        throw new Error("HTLC UTXO not found on blockchain")
      }
    }
    throw new Error(`Failed to refund BTC HTLC: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Broadcast a signed Bitcoin transaction to the network
 * @param signedTxHex - The signed transaction in hex format
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise resolving to transaction ID
 * @throws Error if broadcast fails
 */
export async function broadcastBTCTransaction(signedTxHex: string, isTestnet: boolean = false): Promise<string> {
  try {
    if (!signedTxHex) {
      throw new Error("Signed transaction hex is required")
    }

    // Determine the appropriate API endpoint based on network
    const apiUrl = isTestnet
      ? "https://api.blockcypher.com/v1/btc/test3/txs/push"
      : "https://api.blockcypher.com/v1/btc/main/txs/push"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx: signedTxHex,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(`Broadcast failed: ${errorData?.error || response.statusText}`)
    }

    const result = await response.json()
    return result.tx.hash
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("broadcast failed")) {
        throw new Error("Failed to broadcast transaction to Bitcoin network")
      }
    }
    throw new Error(`Broadcast error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Fetch Bitcoin UTXOs from mempool.space API
 * @param address - Bitcoin address to fetch UTXOs for
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise resolving to array of UTXOs
 * @throws Error if fetch fails
 */
export async function fetchBTCUTXOsFromMempool(address: string, isTestnet: boolean = false): Promise<BTCUTXO[]> {
  try {
    if (!address) {
      throw new Error("Bitcoin address is required")
    }

    const baseUrl = isTestnet ? "https://mempool.space/testnet" : "https://mempool.space"
    const response = await fetch(`${baseUrl}/api/address/${address}/utxo`)

    if (!response.ok) {
      throw new Error(`Failed to fetch UTXOs from mempool.space: ${response.statusText}`)
    }

    const utxos = await response.json()
    return utxos as BTCUTXO[]
  } catch (error) {
    throw new Error(
      `Error fetching UTXOs from mempool.space: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

/**
 * Fetch Bitcoin balance from mempool.space API
 * @param address - Bitcoin address to fetch balance for
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise resolving to balance information
 * @throws Error if fetch fails
 */
export async function fetchBTCBalanceFromMempool(address: string, isTestnet: boolean = false): Promise<BTCBalance> {
  try {
    if (!address) {
      throw new Error("Bitcoin address is required")
    }

    const baseUrl = isTestnet ? "https://mempool.space/testnet" : "https://mempool.space"
    const response = await fetch(`${baseUrl}/api/address/${address}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch balance from mempool.space: ${response.statusText}`)
    }

    const balance = await response.json()
    return balance as BTCBalance
  } catch (error) {
    throw new Error(
      `Error fetching balance from mempool.space: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

/**
 * Fetch Bitcoin UTXOs from blockstream.info API
 * @param address - Bitcoin address to fetch UTXOs for
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise resolving to array of UTXOs
 * @throws Error if fetch fails
 */
export async function fetchBTCUTXOsFromBlockstream(address: string, isTestnet: boolean = false): Promise<BTCUTXO[]> {
  try {
    if (!address) {
      throw new Error("Bitcoin address is required")
    }

    const baseUrl = isTestnet ? "https://blockstream.info/testnet" : "https://blockstream.info"
    const response = await fetch(`${baseUrl}/api/address/${address}/utxo`)

    if (!response.ok) {
      throw new Error(`Failed to fetch UTXOs from blockstream.info: ${response.statusText}`)
    }

    const utxos = await response.json()
    return utxos as BTCUTXO[]
  } catch (error) {
    throw new Error(
      `Error fetching UTXOs from blockstream.info: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

/**
 * Get comprehensive Bitcoin balance and UTXOs for an address
 * Uses mempool.space as primary source with blockstream.info as fallback
 * @param address - Bitcoin address to fetch data for
 * @param isTestnet - Whether to use testnet or mainnet
 * @returns Promise resolving to balance response with UTXOs
 * @throws Error if both APIs fail
 */
export async function getBTCBalance(address: string, isTestnet: boolean = false): Promise<BTCBalanceResponse> {
  try {
    if (!address) {
      throw new Error("Bitcoin address is required")
    }

    let utxos: BTCUTXO[] = []
    let balance: BTCBalance | null = null

    // Try mempool.space first
    try {
      utxos = await fetchBTCUTXOsFromMempool(address, isTestnet)
      balance = await fetchBTCBalanceFromMempool(address, isTestnet)
    } catch (mempoolError) {
      console.warn("mempool.space failed, trying blockstream.info:", mempoolError)

      // Fallback to blockstream.info
      try {
        utxos = await fetchBTCUTXOsFromBlockstream(address, isTestnet)

        // Calculate balance from UTXOs since blockstream doesn't provide balance endpoint
        const confirmedUtxos = utxos.filter((utxo) => utxo.status.confirmed)
        const unconfirmedUtxos = utxos.filter((utxo) => !utxo.status.confirmed)

        const confirmedBalance = confirmedUtxos.reduce((sum, utxo) => sum + utxo.value, 0)
        const unconfirmedBalance = unconfirmedUtxos.reduce((sum, utxo) => sum + utxo.value, 0)

        balance = {
          address,
          chain_stats: {
            funded_txo_count: confirmedUtxos.length,
            funded_txo_sum: confirmedBalance,
            spent_txo_count: 0,
            spent_txo_sum: 0,
            tx_count: 0,
          },
          mempool_stats: {
            funded_txo_count: unconfirmedUtxos.length,
            funded_txo_sum: unconfirmedBalance,
            spent_txo_count: 0,
            spent_txo_sum: 0,
            tx_count: 0,
          },
        }
      } catch (blockstreamError) {
        throw new Error(
          `Both mempool.space and blockstream.info failed: ${mempoolError instanceof Error ? mempoolError.message : "Unknown error"}, ${blockstreamError instanceof Error ? blockstreamError.message : "Unknown error"}`,
        )
      }
    }

    if (!balance) {
      throw new Error("Failed to fetch balance data from both APIs")
    }

    const confirmedBalance = balance.chain_stats.funded_txo_sum - balance.chain_stats.spent_txo_sum
    const unconfirmedBalance = balance.mempool_stats.funded_txo_sum - balance.mempool_stats.spent_txo_sum
    const totalBalance = confirmedBalance + unconfirmedBalance

    return {
      balance: {
        confirmed: confirmedBalance,
        unconfirmed: unconfirmedBalance,
        total: totalBalance,
      },
      utxos,
      address,
      network: isTestnet ? "testnet" : "mainnet",
    }
  } catch (error) {
    throw new Error(`Failed to get BTC balance: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
