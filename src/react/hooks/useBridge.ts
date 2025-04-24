import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { BridgeParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for performing bridge operations
 * @returns A mutation object for bridge operations that can be used with React Query
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
    onSuccess: (_, variables) => {
      const addressesHash = getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )

      // Invalidate balance, tokens, address info, and transactions
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network] })

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", network, addressesHash] })
      }

      // Also invalidate specific token info if token_id was provided
      if (variables.token_id) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })
      }
    },
  })
}
