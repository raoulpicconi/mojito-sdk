import { useQuery } from "@tanstack/react-query"
import { useAccount } from "./useAccount"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"

export function useBalance() {
  const client = useClient()
  const { data } = useAccount()

  return useQuery({
    queryKey: ["mintlayer", "balance", data?.isConnected ? data?.address : null],
    queryFn: async () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.getBalance()
    },
    enabled: data?.isConnected,
  })
}
