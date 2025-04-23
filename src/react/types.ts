import type { Network } from "../index.d"

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
  network: Network | null
  retryCount: number
  apiServer: string
}
