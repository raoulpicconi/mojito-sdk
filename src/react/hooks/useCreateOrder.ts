import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { CreateOrderParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

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
    mutationFn: async (params: CreateOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.createOrder(params)
      return client.broadcastTx(response)
    },
    onSuccess: async () => {
      const addressesHash = await getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )
      const currentNetwork = network || "mainnet"

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "accountOrders", currentNetwork, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "availableOrders", currentNetwork, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", currentNetwork, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", currentNetwork, addressesHash] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", currentNetwork] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", currentNetwork] })
    },
  })
}
