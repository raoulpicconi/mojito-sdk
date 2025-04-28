import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeTokenAuthorityParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for changing the authority of a token
 * @returns A mutation object for changing token authority that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useChangeTokenAuthority() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: ChangeTokenAuthorityParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.changeTokenAuthority(params)
      return client.broadcastTx(response)
    },
    onSuccess: async (_, variables) => {
      const addressesHash = await getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )
      const currentNetwork = network || "mainnet"

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", currentNetwork, variables.token_id] })
      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", currentNetwork, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", currentNetwork, addressesHash] })
      }

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", currentNetwork] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", currentNetwork] })
    },
  })
}
