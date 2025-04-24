import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BurnParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for burning tokens
 * @returns A mutation object for burning tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBurnToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: BurnParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.burn(params)
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
