import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { MintTokenParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"
/**
 * Hook for minting new tokens
 * @returns A mutation object for minting tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useMintToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: MintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.mintToken(params)
      return client.broadcastTx(response)
    },
    onSuccess: async (_, variables) => {
      const currentUserAddressesHash = await getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )
      const currentNetwork = network || "mainnet"

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", currentNetwork, variables.token_id] })
      if (currentUserAddressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", currentNetwork, currentUserAddressesHash] })
        queryClient.invalidateQueries({
          queryKey: ["mintlayer", "tokensOwned", currentNetwork, currentUserAddressesHash],
        })
      }

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", currentNetwork] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", currentNetwork] })
    },
  })
}
