import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAllAddressUtxosParams {
  address: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseAllAddressUtxosOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getAllAddressUtxos"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching all UTXOs (Unspent Transaction Outputs) for a specific address, including spent ones
 * @param params - Parameters for fetching all address UTXOs
 * @param params.address - The address to fetch all UTXOs for
 * @param options - Optional useQuery options
 * @returns A query object containing the complete list of UTXOs for the specified address
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAllAddressUtxos(params: UseAllAddressUtxosParams, options?: UseAllAddressUtxosOptions) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "allAddressUtxos", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAllAddressUtxos(address)
    },
    ...options,
  })
}
