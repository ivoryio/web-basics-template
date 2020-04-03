import { useEffect, useRef } from "react"

export const useDebounce = (fn = () => {}, ms = 0, args = []) => {
  useUpdateEffect(() => {
    const handle = setTimeout(() => fn(args), ms)

    return () => {
      clearTimeout(handle)
    }
  }, args)
}

const useUpdateEffect = (effect, deps) => {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      return effect()
    }
  }, [deps, effect])
}
