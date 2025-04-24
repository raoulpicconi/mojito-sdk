import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for submitting a transaction to the network
 * @returns A mutation object for submitting transactions that can be used with React Query
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useSubmitTransaction() {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (transaction: string) => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.submitTransaction(transaction)
    },
    onSuccess: () => {
      // Submit is generic, invalidate broadly to be safe.
      const address = accountData?.isConnected ? accountData?.address : null

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })

      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", network, address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "accountOrders", network, address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "availableOrders", network, address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegations", network, address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegationsTotal", network, address] })
      }
    },
  })
}
