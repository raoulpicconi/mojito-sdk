import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ConcludeOrderParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for concluding an order
 * @returns A mutation object for concluding orders that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useConcludeOrder() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: ConcludeOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.concludeOrder(params)
      return client.broadcastTx(response)
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
