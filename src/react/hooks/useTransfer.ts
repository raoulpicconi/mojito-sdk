import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { TransferParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for performing token transfers
 * @returns A mutation object for transfer operations that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useTransfer() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: TransferParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.transfer(params)
      return client.broadcastTx(response)
    },
    onSuccess: (_, variables) => {
      const addressesHash = getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, addressesHash] })
      }

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
