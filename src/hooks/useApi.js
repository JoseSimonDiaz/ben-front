import { useState, useEffect, useCallback } from 'react'

export default function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, refetch: load }
}
