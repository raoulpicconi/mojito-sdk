import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BTCHTLCCreateRequest, BTCHTLCCreateResponse } from "../../types"
import { createBTCHTLC, broadcastBTCTransaction } from "../../bitcoin"
import { useNetwork } from "./useNetwork"

/**
 * Hook for creating Bitcoin HTLC transactions
 * @returns A mutation object for creating BTC HTLC transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useCreateBTCHTLC(): UseMutationResult<
  { response: BTCHTLCCreateResponse; txId: string },
  Error,
  { request: BTCHTLCCreateRequest; isTestnet?: boolean }
> {
  const client = useClient()
  const queryClient = useQueryClient()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async ({ request, isTestnet = network === "testnet" }) => {
      if (!client) throw new MintlayerClientNotFoundError()

      // Create the HTLC
      const response = await createBTCHTLC(client, request)

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
