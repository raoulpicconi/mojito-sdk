import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"

export interface UseAddressTokenAuthorityParams {
  address: string
}

export function useAddressTokenAuthority(params: UseAddressTokenAuthorityParams) {
  const { address } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "addressTokenAuthority", network, address],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getAddressTokenAuthority(address)
    },
  })
}
