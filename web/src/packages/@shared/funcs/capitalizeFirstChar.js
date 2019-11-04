export const capitalizeFirstChar = (...value) => {
  if (typeof value === "string")
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`

  return value
    .map(string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`)
    .join(" ")
}
