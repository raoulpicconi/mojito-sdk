import { useQuery } from "@tanstack/react-query"
import { useConfig } from "./useConfig"
import { useNetwork } from "./useNetwork"
import { MintlayerAPIClient } from "../../api"

export interface UseAllAddressUtxosParams {
  address: string
}

export function useAllAddressUtxos(params: UseAllAddressUtxosParams) {
  const { address } = params
  const { network } = useNetwork()
  const { apiServer } = useConfig()

  return useQuery({
    queryKey: ["mintlayer", "allAddressUtxos", network, address],
    queryFn: () => {
      const apiClient = new MintlayerAPIClient(apiServer)
      return apiClient.getAllAddressUtxos(address)
    },
  })
}
