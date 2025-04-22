import { useQuery } from "@tanstack/react-query"
import { MintlayerAPIClient } from "../../api"
import { useNetwork } from "./useNetwork"
import { useConfig } from "./useConfig"

export interface UseAddressInfoParams {
  address: string
}

export function useAddressInfo(params: UseAddressInfoParams) {
  const { address } = params
  const { network } = useNetwork()
  const { apiServer } = useConfig()

  return useQuery({
    queryKey: ["mintlayer", "addressInfo", network, address],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getAddress(address)
    },
  })
}
