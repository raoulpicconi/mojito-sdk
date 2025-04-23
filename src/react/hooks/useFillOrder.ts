import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { FillOrderParams } from "../../index.d"

/**
 * Hook for filling an existing order
 * @returns A mutation object for filling orders that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useFillOrder() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: FillOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.fillOrder(params)
    },
  })
}
