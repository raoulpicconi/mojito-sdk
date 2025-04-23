import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressUtoxosParams {
  address: string
}

/**
 * Hook for fetching UTXOs (Unspent Transaction Outputs) for a specific address
 * @param params - Parameters for fetching address UTXOs
 * @param params.address - The address to fetch UTXOs for
 * @returns A query object containing the list of UTXOs for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressUtxos(params: UseAddressUtoxosParams) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "addressUtxos", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddressUtxos(address)
    },
  })
}
