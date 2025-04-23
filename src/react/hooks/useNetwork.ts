import { useConfig } from "./useConfig"

export function useNetwork() {
  const { setNetwork: setConfigNetwork, state } = useConfig()

  const setNetwork = async (params: { network: "mainnet" | "testnet" }) => {
    return setConfigNetwork(params.network)
  }

  return {
    network: state.network,
    setNetwork,
  }
}
