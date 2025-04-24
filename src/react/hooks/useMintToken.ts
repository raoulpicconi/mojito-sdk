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
    onSuccess: (_, variables) => {
      const currentUserAddressesHash = getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )

      // Invalidate specific token info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network] })

      // Invalidate current user's balance and address info (for fees etc.)
      if (currentUserAddressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, currentUserAddressesHash] })
      }

      // Invalidate general transactions
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
