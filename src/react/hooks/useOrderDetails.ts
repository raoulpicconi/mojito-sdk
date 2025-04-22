import { useQuery } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"

export interface UseOrderDetailsParams {
  order_id: string
}

export function useOrderDetails(params: UseOrderDetailsParams) {
  const client = useClient()

  return useQuery({
    queryKey: ["mintlayer", "order-details", params.order_id],
    queryFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.fetchOrderDetails(params)
    },
  })
}
