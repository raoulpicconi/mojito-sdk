"use client"

import { useQuery } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { CheckConnectionResponse } from "../../index.d"
import { useNetwork } from "./useNetwork"

/**
 * Hook for accessing the current account information
 * @returns A query object containing the account connection status and address
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useAccount() {
  const client = useClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "account", network],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.request<CheckConnectionResponse>({ method: "checkConnection" })
    },
  })
}
