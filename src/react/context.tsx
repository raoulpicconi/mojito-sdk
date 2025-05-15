"use client"

import { localStorageService } from "../storage"
import { MintlayerConfig, MintlayerState, Storage, StorageKeys } from "./types"
import React, { createContext, ReactNode, useMemo, useState, useEffect, useCallback, useRef } from "react"
import { AccountAddresses, Network } from "../types"
import { MintlayerAPIClient } from "../api"
import { isValidUrl, normalizeUrl } from "../utils"
import { Client } from "@mintlayer/sdk"
import { useQueryClient } from "@tanstack/react-query"

interface MintlayerProviderProps {
  children: ReactNode
  config: MintlayerConfig
}

interface MintlayerContextValue {
  client: Client | null
  state: MintlayerState
  setNetwork: (network: Network) => void
  setAddresses: (addresses: AccountAddresses) => void
  storageService: Storage
  storageKeys: StorageKeys
  apiClient: MintlayerAPIClient
}

export const MintlayerContext = createContext<MintlayerContextValue | null>(null)

const defaultApiServer = {
  testnet: "",
  mainnet: "",
}

export function MintlayerProvider({ children, config }: MintlayerProviderProps) {
  const {
    storageKeys = { connectionState: "mintlayer_connection_state", network: "mintlayer_network" },
    storage,
    autoConnect = true,
    apiServer = "https://api-server.mintlayer.org/api/v2",
  } = config

  const storageService = storage ?? localStorageService

  const queryClient = useQueryClient()

  const client = useRef<Client | null>(null)
  const [state, setState] = useState<MintlayerState>(() => {
    const savedNetwork = storageService.getItem(storageKeys.network) as Network | null

    const network = savedNetwork || config.defaultNetwork || "mainnet"

    let normalizedApiServer = apiServer
    if (isValidUrl(apiServer)) {
      normalizedApiServer = normalizeUrl(apiServer)
    } else {
      normalizedApiServer = defaultApiServer[network]
    }

    return {
      network,
      isExtensionInstalled: false,
      version: "",
      apiServer: normalizedApiServer,
      addresses: {
        mainnet: { receiving: [], change: [] },
        testnet: { receiving: [], change: [] },
      },
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkClient = async () => {
      const mintlayer = await Client.create({
        network: state.network as "mainnet" | "testnet",
        autoRestore: false,
      } as any)

      if (mintlayer?.isMintlayer) {
        client.current = mintlayer
        setState((prev) => ({
          ...prev,
          isExtensionInstalled: window.mojito?.isExtension ?? false,
          version: window.mojito?.version ?? "",
        }))
        setNetwork(state.network || "mainnet")

        const isDisconnected = storageService.getItem(storageKeys.connectionState) === "disconnected"

        if (autoConnect && !isDisconnected) {
          const addresses = await client.current.connect()
          setAddresses(addresses as any)
          queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
        }
      }
    }

    checkClient()
  }, [])

  const setNetwork = useCallback(
    (network: Network) => {
      if (client.current) {
        client.current.setNetwork(network)
      }
      setState((prev) => ({ ...prev, network }))
      storageService.setItem(storageKeys.network, network)
    },
    [storageService, storageKeys.network, client],
  )

  const setAddresses = useCallback((addresses: AccountAddresses) => {
    setState((prev) => ({ ...prev, addresses }))
  }, [])

  const apiClient = useMemo(() => {
    return new MintlayerAPIClient(state.apiServer)
  }, [state.apiServer])

  const value = useMemo(
    () => ({
      client: client.current,
      state,
      setNetwork,
      storageService,
      storageKeys,
      apiClient,
      setAddresses,
    }),
    [client, state, setNetwork, apiClient, storageService, storageKeys, setAddresses],
  )

  return <MintlayerContext.Provider value={value}>{children}</MintlayerContext.Provider>
}
