import { useMutation } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { useQueryClient } from "@tanstack/react-query"

export function useConnect() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.connect()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "account-orders"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "available-orders"] })
    },
  })
}
