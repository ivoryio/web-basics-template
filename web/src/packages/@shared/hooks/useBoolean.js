import { useState } from "react"

export function useBoolean (initialState) {
  const [value, setValue] = useState(initialState)

  const toggleValue = callback =>
    setValue(prevValue => {
      if (callback && typeof callback === "function") callback(prevValue)
      return !prevValue
    })

  return [value, setValue, toggleValue]
}
