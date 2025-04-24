import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { FillOrderParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for filling an existing order
 * @returns A mutation object for filling orders that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useFillOrder() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: FillOrderParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.fillOrder(params)
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
