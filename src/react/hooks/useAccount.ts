"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { CheckConnectionResponse, MintlayerClient } from "../../types"
import { useNetwork } from "./useNetwork"

// Define the type for the options, excluding queryKey and queryFn
type UseAccountOptions = Omit<
  UseQueryOptions<
    // Use the explicitly defined return type
    CheckConnectionResponse,
    Error // Default error type, adjust if needed
  >,
  "queryKey" | "queryFn"
>

/**
 * Hook for accessing the current account information
 * @param options - Optional useQuery options
 * @returns A query object containing the account connection status and address
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useAccount(options?: UseAccountOptions) {
  const client = useClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "account", network],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.request<CheckConnectionResponse>({ method: "checkConnection" })
    },
    // Spread the additional options
    ...options,
  })
}
