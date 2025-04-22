import { useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { useNetwork } from "./useNetwork"

export function useXPub() {
  const client = useClient()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["xpub", network],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getXPub()
    },
  })
}
