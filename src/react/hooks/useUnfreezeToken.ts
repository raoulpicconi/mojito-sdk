import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { UnfreezeTokenParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for unfreezing a frozen token
 * @returns A mutation object for unfreezing tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useUnfreezeToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: UnfreezeTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.unfreezeToken(params)
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
