import { useQuery } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { getAddressesHash } from "../../utils"

/**
 * Hook for calculating the SHA-256 hash of the current account's addresses
 * for the selected network.
 * @returns A query object containing the addresses hash string.
 */
export function useAddressesHash() {
  const { data: accountData } = useAccount()
  const { network } = useNetwork()

  const currentNetwork = network || "mainnet"
  // Determine the address data based on connection status and network
  const addressData = accountData?.isConnected ? accountData?.address[currentNetwork] : null

  // Use react-query to compute and cache the hash
  return useQuery({
    // The query key includes the network and the address data itself
    // so it recalculates when either changes.
    queryKey: ["addressesHash", currentNetwork, addressData],
    // The query function calls the async hashing utility
    queryFn: () => getAddressesHash(addressData),
    // Only enable the query if we actually have address data
    enabled: !!addressData,
    // The hash is stable for the given inputs, so set staleTime to Infinity
    staleTime: Infinity,
    // Keep previous data while fetching new hash on network/address change
    // Use placeholderData to keep showing the previous hash while refetching
    placeholderData: (previousData) => previousData,
  })
}
