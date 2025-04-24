import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { FreezeTokenParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for freezing a token
 * @returns A mutation object for freezing tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useFreezeToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: FreezeTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.freezeToken(params)
    },
    onSuccess: (_, variables) => {
      const address = accountData?.isConnected ? accountData?.address : null

      // Invalidate specific token info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })

      // Invalidate transactions and potentially address info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }
    },
  })
}
