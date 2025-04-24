import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { IssueTokenParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for issuing new tokens
 * @returns A mutation object for issuing tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useIssueToken() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: IssueTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      const response = await client.issueToken(params)
      return client.broadcastTx(response)
    },
    onSuccess: () => {
      const addressesHash = getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )

      // Invalidate token lists, transactions, balance, and address info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokenIds", network] })
      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokensOwned", network, addressesHash] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", network, addressesHash] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
