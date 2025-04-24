import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ConcludeOrderParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

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
      const addressesHash = getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "accountOrders", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "availableOrders", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", network, addressesHash] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
