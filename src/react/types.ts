import type { AccountAddresses, Network } from "../types"

declare global {
  interface Window {
    mojito?: {
      connect: () => Promise<string[]>
      connectedAddresses: string[]
      disconnect: () => Promise<void>
      isConnected: () => boolean
      isExtension: boolean
      network: Network
      on: (event: string, callback: (addresses: string[]) => void) => void
      request: (method: string, params?: any) => Promise<any>
      restore: () => Promise<boolean>
      version: string
    }
  }
}
export interface Storage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export interface StorageKeys {
  connectionState: string
  network: string
}

export interface MintlayerConfig {
  defaultNetwork?: Network
  storageKeys?: StorageKeys
  storage?: Storage
  maxRetries?: number
  initialDelay?: number
  apiServer?: string
  autoConnect?: boolean
}

export interface MintlayerState {
  isExtensionInstalled: boolean
  version: string
  network: Network | null
  retryCount: number
  apiServer: string
  addresses: AccountAddresses
}
