import { useQuery } from "@tanstack/react-query"
import { useNetwork } from "./useNetwork"
import { useApiClient } from "./useApiClient"
import { MintlayerApiClientNotFoundError } from "../errors"

export interface UsePoolDelegationsParams {
  poolId: string
}

export function usePoolDelegations(params: UsePoolDelegationsParams) {
  const { poolId } = params
  const { network } = useNetwork()
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ["mintlayer", "poolDelegations", network, poolId],
    queryFn: () => {
      if (!apiClient) throw new MintlayerApiClientNotFoundError()
      return apiClient.getPoolDelegations(poolId)
    },
  })
}
