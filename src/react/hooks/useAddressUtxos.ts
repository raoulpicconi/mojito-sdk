import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"

export interface UseAddressUtoxosParams {
  address: string
}

export function useAddressUtxos(params: UseAddressUtoxosParams) {
  const { address } = params
  const { apiServer } = useConfig()
  const { network } = useNetwork()

  return useQuery({
    queryKey: ["mintlayer", "addressUtxos", network, address],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getAddressUtxos(address)
    },
  })
}
