import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { BTCCredentialsResponse } from "../../types"
import { getBTCCredentials } from "../../bitcoin"

export type UseBTCCredentialsOptions = Omit<UseQueryOptions<BTCCredentialsResponse, Error>, "queryKey" | "queryFn">

/**
 * Hook for getting Bitcoin credentials (address and public key)
 * @returns A query object for BTC credentials that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useBTCCredentials(options?: UseBTCCredentialsOptions) {
  const client = useClient()

  return useQuery({
    queryKey: ["mintlayer", "btc", "credentials"],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return getBTCCredentials(client)
    },
    enabled: !!client,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if wallet doesn't support Bitcoin operations
      if (error.message.includes("does not support Bitcoin operations")) {
        return false
      }
      return failureCount < 3
    },
    ...options,
  })
}
