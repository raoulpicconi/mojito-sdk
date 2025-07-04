import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { PreviewUtxoChangeParams, PreviewUtxoChangeResponse } from "../../types"

/**
 * Hook for previewing UTXO changes before transaction execution
 * @returns A mutation object for previewing UTXO changes that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function usePreviewUtxoChange(): ReturnType<
  typeof useMutation<PreviewUtxoChangeResponse, Error, PreviewUtxoChangeParams>
> {
  const client = useClient()

  return useMutation({
    mutationFn: async (params: PreviewUtxoChangeParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.previewUtxoChange(params) as PreviewUtxoChangeResponse
    },
  })
}
