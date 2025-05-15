"use client"

import { localStorageService } from "../storage"
import { MintlayerConfig, MintlayerState, Storage, StorageKeys } from "./types"
import React, { createContext, ReactNode, useMemo, useState, useEffect, useCallback, useRef } from "react"
import { Network } from "../types"
import { MintlayerAPIClient } from "../api"
import { isValidUrl, normalizeUrl } from "../utils"
import { Client } from "@mintlayer/sdk"

interface MintlayerProviderProps {
  children: ReactNode
  config: MintlayerConfig
}

interface MintlayerContextValue {
  client: Client | null
  state: MintlayerState
  setNetwork: (network: Network) => void
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
    maxRetries = 5,
    initialDelay = 1000,
    autoConnect = true,
    apiServer = "https://api-server.mintlayer.org/api/v2",
  } = config

  const storageService = storage ?? localStorageService

  const client = useRef<Client | null>(null)
  const pendingTimeout = useRef<NodeJS.Timeout | null>(null)
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
      retryCount: 0,
      apiServer: normalizedApiServer,
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

        if (autoConnect && !isDisconnected && !client.current.isConnected()) {
          client.current.connect()
        }
        return
      }

      if (state.retryCount >= maxRetries) {
        console.warn("Mintlayer client not found after maximum retries")
        return
      }

      const delay = initialDelay * Math.pow(2, state.retryCount) // Exponential backoff
      setState((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }))

      pendingTimeout.current = setTimeout(checkClient, delay)
    }

    checkClient()

    return () => {
      if (pendingTimeout.current) {
        clearTimeout(pendingTimeout.current)
        pendingTimeout.current = null
      }
    }
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
    }),
    [client, state, setNetwork, apiClient, storageService, storageKeys],
  )

  return <MintlayerContext.Provider value={value}>{children}</MintlayerContext.Provider>
}
