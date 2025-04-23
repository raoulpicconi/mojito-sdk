import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { UnmintTokenParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for unminting tokens
 * @returns A mutation object for unminting tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useUnmintToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: UnmintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.unmintToken(params)
    },
    onSuccess: (_, variables) => {
      const address = accountData?.isConnected ? accountData?.address : null
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
