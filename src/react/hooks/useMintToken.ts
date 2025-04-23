import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { MintTokenParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

/**
 * Hook for minting new tokens
 * @returns A mutation object for minting tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useMintToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: (params: MintTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.mintToken(params)
    },
    onSuccess: (_, variables) => {
      const currentUserAddress = accountData?.isConnected ? accountData?.address : null
      const recipientAddress = variables.destination

      // Invalidate specific token info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "token", network, variables.token_id] })

      // Invalidate recipient's balance, tokens, and address info
      if (recipientAddress) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", recipientAddress] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokens-owned", recipientAddress] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, recipientAddress] })
      }

      // Invalidate current user's balance and address info (for fees etc.)
      if (currentUserAddress) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", currentUserAddress] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, currentUserAddress] })
      }

      // Invalidate general transactions
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
