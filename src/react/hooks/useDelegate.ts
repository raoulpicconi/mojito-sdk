import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { DelegateParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

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
    mutationFn: async (params: DelegateParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.delegate(params)
      return client.broadcastTx(response)
    },
    onSuccess: () => {
      const addressesHash = getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegations", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegationsTotal", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, addressesHash] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
