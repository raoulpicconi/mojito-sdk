import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { DataDepositParams } from "../../types"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for performing data deposit operations
 * @returns A mutation object for data deposit operations that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useDataDeposit() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (data: DataDepositParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.dataDeposit(data)
      return client.broadcastTx(response)
    },
    onSuccess: () => {
      const address = accountData?.isConnected ? accountData?.address : null

      // Invalidate transactions and potentially balance/address info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }
    },
  })
}
