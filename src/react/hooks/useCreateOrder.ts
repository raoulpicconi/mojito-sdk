import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { CreateOrderParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for creating a new order
 * @returns A mutation object for creating orders that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useCreateOrder() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: CreateOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.createOrder(params)
    },
    onSuccess: () => {
      const address = accountData?.isConnected ? accountData?.address : null
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "accountOrders", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "availableOrders", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
