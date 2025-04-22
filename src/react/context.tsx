"use client"

import { localStorageService } from "../storage"
import { MintlayerConfig, MintlayerState } from "./types"
import React, { createContext, ReactNode, useMemo, useState, useEffect, useCallback, useRef } from "react"
import { CheckConnectionResponse, MintlayerClient, Network } from "../index.d"

interface MintlayerProviderProps {
  children: ReactNode
  config: MintlayerConfig
}

interface MintlayerContextValue {
  client: MintlayerClient | null
  state: MintlayerState
  setNetwork: (network: Network) => void
}

export const MintlayerContext = createContext<MintlayerContextValue | undefined>(undefined)

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

  const client = useRef<MintlayerClient | null>(null)
  const pendingTimeout = useRef<number | null>(null)
  const [state, setState] = useState<MintlayerState>(() => {
    const savedNetwork = storageService.getItem(storageKeys.network) as Network | null

    const network = savedNetwork || config.defaultNetwork || "mainnet"

    const isExtensionInstalled = typeof window !== "undefined" && !!window.mintlayer?.isMintlayer
    return {
      network,
      isExtensionInstalled,
      retryCount: 0,
      apiServer,
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkClient = async () => {
      if (window?.mintlayer?.isMintlayer) {
        client.current = window.mintlayer
        setState((prev) => ({ ...prev, isExtensionInstalled: true }))

        if (autoConnect) {
          const res = await client.current.request<CheckConnectionResponse>({ method: "checkConnection" })

          if (!res.isConnected) {
            client.current.connect()
          }
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
        client.current.setNetwork({ network })
      }
      setState((prev) => ({ ...prev, network }))
      storageService.setItem(storageKeys.network, network)
    },
    [client],
  )

  const value = useMemo(
    () => ({
      client: client.current,
      state,
      setNetwork,
    }),
    [client, state, setNetwork],
  )

  return <MintlayerContext.Provider value={value}>{children}</MintlayerContext.Provider>
}
