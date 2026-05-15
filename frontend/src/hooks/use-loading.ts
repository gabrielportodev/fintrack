import { useCallback, useState } from 'react'

export const useLoading = (initialState: boolean = false) => {
  const [loading, setLoading] = useState(initialState)

  const startLoading = useCallback(() => setLoading(true), [])
  const stopLoading = useCallback(() => setLoading(false), [])

  return { loading, startLoading, stopLoading }
}
