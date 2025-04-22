import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { CreateOrderParams } from "../../index.d"

export function useCreateOrder() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.createOrder(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account-orders"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "available-orders"] })
    },
  })
}
