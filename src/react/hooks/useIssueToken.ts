import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { IssueTokenParams } from "../../index.d"

/**
 * Hook for issuing new tokens
 * @returns A mutation object for issuing tokens that can be used with React Query
 * @throws {MintlayerClientNotFoundError} If the Mintlayer client is not initialized
 */
export function useIssueToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: IssueTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.issueToken(params)
    },
  })
}
