import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { CreateOrderParams } from "../../index.d"

/**
 * Hook for creating a new order
 * @returns A mutation object for creating orders that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useCreateOrder() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: CreateOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.createOrder(params)
    },
  })
}
