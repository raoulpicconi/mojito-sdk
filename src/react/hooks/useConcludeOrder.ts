import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"

export interface ConcludeOrderRequestParams {
  order_id: string
}

export function useConcludeOrder() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: ConcludeOrderRequestParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.concludeOrder(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account-orders"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "available-orders"] })
    },
  })
}
