import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"

export interface UseAddressDelegationsParams {
  address: string
}

export function useAddressDelegations(params: UseAddressDelegationsParams) {
  const { address } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "addressDelegations", network, address],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getAddressDelegations(address)
    },
  })
}
