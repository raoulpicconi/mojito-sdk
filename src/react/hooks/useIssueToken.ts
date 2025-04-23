import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { IssueTokenParams } from "../../index.d"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"

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
    mutationFn: (params: IssueTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.issueToken(params)
    },
    onSuccess: () => {
      const address = accountData?.isConnected ? accountData?.address : null

      // Invalidate token lists, transactions, balance, and address info
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokenIds", network] })
      if (address) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "tokens-owned", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", address] })
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", network, address] })
      }
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", network] })
    },
  })
}
