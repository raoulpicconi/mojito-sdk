import { useQuery } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

export function useNetwork() {
  const client = useClient()

  const { data: network, ...networkQuery } = useQuery({
    queryKey: ["mintlayer", "network"],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getNetwork()
    },
  })

  const setNetwork = async (params: { network: "mainnet" | "testnet" }) => {
    if (!client) throw new MintlayerClientNotFoundError()
    return client.setNetwork(params)
  }

  return {
    network,
    setNetwork,
    ...networkQuery,
  }
}
