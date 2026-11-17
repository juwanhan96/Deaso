import { useEffect, useState } from 'react'

/**
 * 번들된 데이터로 즉시 렌더하고, Hono API(/api/*) 응답이 오면 교체합니다.
 * API가 실패해도 화면은 초기 데이터로 유지됩니다.
 */
export function useApi<T>(path: string, initial: T): T {
  const [data, setData] = useState<T>(initial)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api${path}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<T>) : Promise.reject(res.status)))
      .then(setData)
      .catch(() => {})
    return () => controller.abort()
  }, [path])

  return data
}
