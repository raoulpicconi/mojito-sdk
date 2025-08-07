import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
import { useBTCCredentials } from "./useBTCCredentials"
import { MintlayerProviderNotFoundError } from "../errors"
import { BTCBalanceResponse } from "../../types"
import { getBTCBalance } from "../../bitcoin"

// Define the type for the options, excluding queryKey and queryFn
type UseBTCBalanceOptions = Omit<UseQueryOptions<BTCBalanceResponse, Error>, "queryKey" | "queryFn">

/**
 * Hook for fetching Bitcoin balance and UTXOs for the connected address
 * Uses mempool.space as primary source with blockstream.info as fallback
 * @param options - Optional useQuery options
 * @returns A query object containing the Bitcoin balance and UTXOs
 * @throws {MintlayerProviderNotFoundError} If the Mintlayer provider is not initialized
 */
export function useBTCBalance(options?: UseBTCBalanceOptions) {
  const { data: accountData } = useAccount()
  const { network } = useNetwork()
  const { data: btcCredentials, isSuccess: isCredentialsReady } = useBTCCredentials()

  const currentNetwork = network || "mainnet"
  const isTestnet = currentNetwork === "testnet"

  return useQuery({
    queryKey: ["mintlayer", "btc", "balance", currentNetwork, btcCredentials?.btcAddress],
    queryFn: async () => {
      if (!btcCredentials?.btcAddress) {
        throw new Error("Bitcoin address not available")
      }
      return getBTCBalance(btcCredentials.btcAddress, isTestnet)
    },
    enabled: !!accountData?.isConnected && isCredentialsReady && !!btcCredentials?.btcAddress,
    staleTime: 30 * 1000, // 30 seconds - Bitcoin data doesn't change frequently
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: (failureCount, error) => {
      // Don't retry if wallet doesn't support Bitcoin operations
      if (error.message.includes("does not support Bitcoin operations")) {
        return false
      }
      // Retry up to 3 times for network errors
      return failureCount < 3
    },
    ...options,
  })
}
