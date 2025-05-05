"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError, MintlayerProviderNotFoundError } from "../errors"
import { AddressData, CheckConnectionResponse, CheckConnectionSuccessNegative } from "../../types"
import { useNetwork } from "./useNetwork"
import { MintlayerContext } from "../context"
import { useContext } from "react"

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
  const context = useContext(MintlayerContext)

  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }

  const { storageService, storageKeys } = context

  return useQuery({
    queryKey: ["mintlayer", "account", network],
    queryFn: async () => {
      const connectionState = storageService.getItem(storageKeys.connectionState)

      if (connectionState === "disconnected") {
        const emptyAddress = { receiving: [], change: [] } as AddressData
        return {
          isConnected: false,
          address: { mainnet: emptyAddress, testnet: emptyAddress },
        } as CheckConnectionSuccessNegative
      }
      if (!client) throw new MintlayerClientNotFoundError()
      return client.request({ method: "checkConnection" })
    },
    // Spread the additional options
    ...options,
  })
}
