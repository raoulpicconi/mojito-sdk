import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { DecorateWithUtxoFetchParams } from "../../types"

/**
 * Hook for decorating transactions with UTXO fetch functionality
 * @returns A mutation object for decorating transactions with UTXO fetch that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDecorateWithUtxoFetch() {
  const client = useClient()

  return useMutation({
    mutationFn: async (params: DecorateWithUtxoFetchParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.decorateWithUtxoFetch(params) as any
    },
  })
}
