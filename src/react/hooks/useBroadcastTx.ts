import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BroadcastTxParams } from "../../types"

/**
 * Hook for broadcasting a transaction to the network
 * @returns A mutation object for broadcasting transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBroadcastTx() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: BroadcastTxParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.broadcastTx(params)
    },
  })
}
