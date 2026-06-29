import { useState, useEffect, useCallback } from 'react'

export default function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    let cancelled = false

    setLoading(true)
    setError(null)
    fetchFn()
      .then((result) => { if (!cancelled) setData(result) })
      .catch((e) => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, deps)

  useEffect(() => { const cleanup = load(); return cleanup }, [load])

  return { data, loading, error, refetch: load }
}
