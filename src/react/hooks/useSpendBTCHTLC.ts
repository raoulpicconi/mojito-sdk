import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BTCHTLCSpendRequest, BTCTransactionResponse } from "../../types"
import { spendBTCHTLC, broadcastBTCTransaction } from "../../bitcoin"
import { useNetwork } from "./useNetwork"

/**
 * Hook for spending (claiming) Bitcoin HTLC transactions
 * @returns A mutation object for spending BTC HTLC transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useSpendBTCHTLC(): UseMutationResult<
  { response: BTCTransactionResponse; txId: string },
  Error,
  { request: BTCHTLCSpendRequest; isTestnet?: boolean }
> {
  const client = useClient()
  const queryClient = useQueryClient()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async ({ request, isTestnet = network === "testnet" }) => {
      if (!client) throw new MintlayerClientNotFoundError()

      // Spend the HTLC
      const response = await spendBTCHTLC(client, request)

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
