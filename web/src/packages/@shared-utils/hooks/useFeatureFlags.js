import { useCallback, useEffect, useRef, useState } from 'react'

import { _checkObjEqual } from '../funcs'

const INITIAL_STATE = process.env.REACT_APP_NODE_ENV === 'development' || false

export const useFeatureFlags = initialState => {
  const [flags, setFlags] = useState({
    ...initialState,
    organizationTeamsFlag: INITIAL_STATE
  })
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      if (Object.keys(flags).length > 0) {
        const updatedFlags = Object.keys(flags).reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: localStorage.getItem(curr) !== null
          }),
          {}
        )
        if (!_checkObjEqual(flags, updatedFlags)) setFlags(updatedFlags)
      }
      isInitialMount.current = false
    }
  }, [flags, setFlags])

  const updateFlag = useCallback(
    updatedFlag => {
      setFlags(prevFlags => ({
        ...prevFlags,
        ...updatedFlag
      }))
    },
    [setFlags]
  )

  useEffect(() => {
    window.addEventListener('storage', watchStorage)
    return () => {
      window.removeEventListener('storage', watchStorage)
    }

    function watchStorage (ev) {
      if (ev.key) {
        const flagValues = ['true', 'false']
        updateFlag({
          [ev.key]:
            ev.newValue &&
            flagValues.some(val => val === ev.newValue.toLowerCase())
              ? JSON.parse(ev.newValue)
              : false
        })
      }
    }
  }, [updateFlag])

  return flags
}
