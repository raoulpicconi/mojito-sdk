"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError, MintlayerProviderNotFoundError } from "../errors"
import { CheckConnectionResponse } from "../../types"
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
      const emptyAddresses = { mainnet: { receiving: [], change: [] }, testnet: { receiving: [], change: [] } }
      const connectionState = storageService.getItem(storageKeys.connectionState)

      if (connectionState === "disconnected") {
        return {
          isConnected: false,
          address: emptyAddresses,
        }
      }
      if (!client) throw new MintlayerClientNotFoundError()
      const res = await client.request({ method: "checkConnection" })
      if (!res.isConnected) {
        return {
          isConnected: false,
          address: emptyAddresses,
        }
      }
      const addresses = await client.getAddresses()
      return {
        isConnected: true,
        address: {
          ...emptyAddresses,
          [network || "mainnet"]: { receiving: addresses.slice(0, 20), change: addresses.slice(20) },
        },
      }
    },
    // Spread the additional options
    ...options,
  })
}
