import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { ChangeTokenAuthorityParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for changing a token's authority
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
    onSuccess: (_, variables) => {
      const currentAddress = accountData?.isConnected ? accountData?.address : null

      // Invalidate specific token info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })

      // Invalidate address info for old and new authority
      if (currentAddress) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, currentAddress] })
        // Invalidate tokens owned by current user just in case authority implies ownership
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", currentAddress] })
      }
      if (variables.new_authority) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, variables.new_authority] })
      }

      // Invalidate general transactions
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
