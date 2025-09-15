"use client"

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError, MintlayerProviderNotFoundError } from "../errors"
import { CheckConnectionResponse } from "../../types"
import { useNetwork } from "./useNetwork"
import { MintlayerContext } from "../context"
import { useContext } from "react"
import { useConfig } from "./useConfig"

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
  const { addresses, addressesByChain } = useConfig()
  const { network } = useNetwork()
  const context = useContext(MintlayerContext)

  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }

  const { storageService, storageKeys } = context

  return useQuery({
    queryKey: ["mintlayer", "account", network, JSON.stringify(addresses), JSON.stringify(addressesByChain)],
    queryFn: async () => {
      const emptyAddresses = { mainnet: { receiving: [], change: [] }, testnet: { receiving: [], change: [] } }
      const emptyAddressesByChain = {
        bitcoin: {
          receiving: [],
          change: [],
          publicKeys: { receiving: [], change: [] },
        },
        mintlayer: {
          receiving: [],
          change: [],
          publicKeys: { receiving: [], change: [] },
        },
      }
      const connectionState = storageService.getItem(storageKeys.connectionState)

      if (connectionState === "disconnected") {
        return {
          isConnected: false,
          address: emptyAddresses,
          addressesByChain: emptyAddressesByChain,
        }
      }
      if (addresses[network || "mainnet"]?.receiving?.length === 0) {
        return {
          isConnected: false,
          address: emptyAddresses,
          addressesByChain: emptyAddressesByChain,
        }
      }
      return {
        isConnected: true,
        address: addresses,
        addressesByChain: addressesByChain,
      }
    },
    // Spread the additional options
    ...options,
  })
}
