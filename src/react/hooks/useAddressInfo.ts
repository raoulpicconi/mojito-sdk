import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressInfoParams {
  address: string
}

// Define the type for the options, excluding queryKey and queryFn
type UseAddressInfoOptions = Omit<
  UseQueryOptions<
    Awaited<ReturnType<MintlayerAPIClient["getAddress"]>>,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching information about a specific address
 * @param params - Parameters for fetching address information
 * @param params.address - The address to fetch information for
 * @param options - Optional useQuery options
 * @returns A query object containing the address information
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressInfo(params: UseAddressInfoParams, options?: UseAddressInfoOptions) {
  const { address } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "addressInfo", network, address],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getAddress(address)
    },
    // Spread the additional options
    ...options,
  })
}
