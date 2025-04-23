import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { DelegateParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for creating a new delegation
 * @returns A mutation object for creating a delegation that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDelegate() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: DelegateParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.delegate(params)
    },
    onSuccess: () => {
      const address = accountData?.isConnected ? accountData?.address : null

      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegations", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegationsTotal", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
