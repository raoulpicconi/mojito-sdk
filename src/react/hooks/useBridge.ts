import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { BridgeParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for bridging tokens
 * @returns A mutation object for bridging tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBridge() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: BridgeParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.bridgeRequest(params)
      return client.broadcastTx(response)
    },
    onSuccess: async (_, variables) => {
      const addressesHash = await getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )
      const currentNetwork = network || "mainnet"

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", currentNetwork, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", currentNetwork, addressesHash] })
      }

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", currentNetwork] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", currentNetwork] })

      if (variables && variables.token_id) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", currentNetwork, variables.token_id] })
      }
    },
  })
}
