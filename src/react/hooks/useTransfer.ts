import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { TransferParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

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
    mutationFn: (params: TransferParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.transfer(params)
    },
    onSuccess: (_, variables) => {
      const senderAddress = accountData?.isConnected ? accountData?.address : null
      const receiverAddress = variables.to

      if (senderAddress) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", senderAddress] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", senderAddress] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, senderAddress] })
      }
      if (receiverAddress) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, receiverAddress] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
