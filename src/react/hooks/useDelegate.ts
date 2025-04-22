import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { DelegateParams } from "../../index.d"

export function useDelegate() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: DelegateParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.delegate(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegations"] })
      queryClient.invalidateQueries({ queryKey: ["mintlayer", "delegations-total"] })
    },
  })
}
