import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BTCHTLCRefundRequest, BTCTransactionResponse } from "../../types"
import { refundBTCHTLC, broadcastBTCTransaction } from "../../bitcoin"
import { useNetwork } from "./useNetwork"

/**
 * Hook for refunding Bitcoin HTLC transactions
 * @returns A mutation object for refunding BTC HTLC transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useRefundBTCHTLC(): UseMutationResult<
  { response: BTCTransactionResponse; txId: string },
  Error,
  { request: BTCHTLCRefundRequest; isTestnet?: boolean }
> {
  const client = useClient()
  const queryClient = useQueryClient()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async ({ request, isTestnet = network === "testnet" }) => {
      if (!client) throw new MintlayerClientNotFoundError()

      // Refund the HTLC
      const response = await refundBTCHTLC(client, request)

      // Broadcast the transaction
      const txId = await broadcastBTCTransaction(response.signedTxHex, isTestnet)

      return { response, txId }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "btc", "credentials"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions"] })
    },
  })
}
