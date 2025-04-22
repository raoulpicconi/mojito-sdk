import { useMutation } from "@tanstack/react-query"
import { MintlayerClientNotFoundError } from "../errors"
import { useClient } from "./useClient"
import { IssueTokenParams } from "../../index.d"

export function useIssueToken() {
  const client = useClient()

  return useMutation({
    mutationFn: (params: IssueTokenParams) => {
      if (!client) throw new MintlayerClientNotFoundError()
      return client.issueToken(params)
    },
  })
}
