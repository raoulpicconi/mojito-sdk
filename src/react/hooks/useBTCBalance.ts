import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useNetwork } from "./useNetwork"
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

  const currentNetwork = network || "mainnet"
  const isTestnet = currentNetwork === "testnet"

  return useQuery({
    queryKey: ["mintlayer", "btc", "balance", currentNetwork, accountData?.addressesByChain.bitcoin.receiving[0]],
    queryFn: async () => {
      if (!accountData?.addressesByChain.bitcoin.receiving[0]) {
        throw new Error("Bitcoin address not available")
      }
      return getBTCBalance(accountData.addressesByChain.bitcoin.receiving[0], isTestnet)
    },
    enabled: !!accountData?.isConnected && !!accountData?.addressesByChain.bitcoin.receiving[0],
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
