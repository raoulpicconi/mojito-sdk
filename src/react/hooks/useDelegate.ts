import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useClient } from "./useClient"
import { MintlayerClientNotFoundError } from "../errors"
import { DelegateParams } from "../../index.d"

/**
 * Hook for creating a new delegation
 * @returns A mutation object for creating a delegation that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
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
