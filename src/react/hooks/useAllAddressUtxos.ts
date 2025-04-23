import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAllAddressUtxosParams {
  address: string
}

/**
 * Hook for fetching all UTXOs (Unspent Transaction Outputs) for a specific address, including spent ones
 * @param params - Parameters for fetching all address UTXOs
 * @param params.address - The address to fetch all UTXOs for
 * @returns A query object containing the complete list of UTXOs for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAllAddressUtxos(params: UseAllAddressUtxosParams) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "allAddressUtxos", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAllAddressUtxos(address)
    },
  })
}
