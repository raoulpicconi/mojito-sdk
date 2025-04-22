import { useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"

export function useDelegationTotal() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "delegation-total", data?.isConnected ? data?.address : null],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getDelegationsTotal()
    },
    enabled: data?.isConnected,
  })
}
