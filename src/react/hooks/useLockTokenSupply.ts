import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { LockTokenSupplyParams } from "../../types"
import { useNetwork } from "./useNetwork"

/**
 * Hook for locking a token's supply
 * @returns A mutation object for locking token supply that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useLockTokenSupply() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: LockTokenSupplyParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.lockTokenSupply(params)
      return client.broadcastTx(response)
    },
    onSuccess: (_, variables) => {
      // Invalidate specific token info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })

      // Invalidate transactions and potentially address info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network] })
    },
  })
}
