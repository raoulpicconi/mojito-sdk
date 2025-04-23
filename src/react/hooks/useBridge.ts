import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { BridgeParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

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
    mutationFn: (params: BridgeParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.bridgeRequest(params)
    },
    onSuccess: (_, variables) => {
      const address = accountData?.isConnected ? accountData?.address : null

      // Invalidate balance, tokens, address info, and transactions
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokens-owned", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }

      // Also invalidate specific token info if token_id was provided
      if (variables.token_id) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })
      }
    },
  })
}
