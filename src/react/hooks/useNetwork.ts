import { useContext } from "react"
import { MintlayerContext } from "../context"
import { MintlayerProviderNotFoundError } from "../errors"

/**
 * Hook for managing the network configuration
 * @returns An object containing:
 *   - network: The current network ('mainnet' | 'testnet')
 *   - setNetwork: Function to update the network configuration
 */
export function useNetwork() {
  const context = useContext(MintlayerContext)

  if (!context) {
    throw new MintlayerProviderNotFoundError()
  }

  const { setNetwork: setConfigNetwork, state } = context

  /**
   * Updates the network configuration
   * @param params - Object containing the network to set
   * @param params.network - The network to switch to ('mainnet' | 'testnet')
   * @returns Promise that resolves when the network is updated
   */
  const setNetwork = async (params: { network: "mainnet" | "testnet" }) => {
    return setConfigNetwork(params.network)
  }

  return {
    network: state.network,
    setNetwork,
  }
}
