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
