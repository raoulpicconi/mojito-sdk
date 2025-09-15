import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { CreateHtlcParams } from "../../types"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for creating HTLC (Hash Time-Locked Contract) transactions
 * @returns A mutation object for creating HTLC transactions that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useCreateHtlc() {
  const client = useClient()
  const queryClient = useQueryClient()
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  return useMutation({
    mutationFn: async (params: CreateHtlcParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.createHtlc(params) as unknown as Promise<{
        transactionHex: string
        refundTx: {
          transactionJSONrepresentation: {
            id: number | null
            inputs: any[]
            outputs: any[]
          }
          transactionBINrepresentation: {
            inputs: any[]
            outputs: any[]
            transactionsize: number
            feeRate: string
          }
          witness: string | null
          transactionHex: string
          htlc: {
            multisig_challenge: string
            witness_input: string
          }
        }
      }>
    },
    onSuccess: async () => {
      const addressesHash = await getAddressesHash(
        accountData?.isConnected ? accountData?.address[network || "mainnet"] : null,
      )
      const currentNetwork = network || "mainnet"

      if (addressesHash) {
        queryClient.invalidateQueries({ queryKey: ["mintlayer", "balance", currentNetwork, addressesHash] })
      }

      queryClient.invalidateQueries({ queryKey: ["mintlayer", "addressInfo", currentNetwork] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "transactions", currentNetwork] })
    },
  })
}
