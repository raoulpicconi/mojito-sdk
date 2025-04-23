import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ConcludeOrderParams } from "../../index.d"

/**
 * Hook for concluding an order
 * @returns A mutation object for concluding orders that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useConcludeOrder() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ConcludeOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.concludeOrder(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account-orders"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "available-orders"] })
    },
  })
}
