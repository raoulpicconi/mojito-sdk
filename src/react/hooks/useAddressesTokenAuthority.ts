import { useQueries, UseQueryOptions } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerAPIClient } from "../../api"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UseAddressesTokenAuthorityParams {
  addresses: string[]
}

type UseAddressesTokenAuthorityOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<MintlayerAPIClient["getAddressTokenAuthority"]>>, Error>,
  "queryKey" | "queryFn"
>

/**
 * Hook for fetching token authority information for a list of addresses
 * @param params - Parameters for fetching address token authority
 * @param params.addresses - The addresses to fetch token authority for
 * @param options - Optional useQuery options
 * @returns An array of query objects containing the token authority information for the specified addresses
 * @throws {MintlayerApiClientNotFoundError} If the API client is not initialized
 */
export function useAddressesTokenAuthority(
  params: UseAddressesTokenAuthorityParams,
  options?: UseAddressesTokenAuthorityOptions,
) {
  const { addresses } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQueries({
    queries: addresses.map((address) => ({
      queryKey: ["mintlayer", "addressTokenAuthority", network, address],
      queryFn: () => {
        if (!apiClient) throw new MintlayerApiClientNotFoundError()
        return apiClient.getAddressTokenAuthority(address)
      },
      ...options,
    })),
  })
}
