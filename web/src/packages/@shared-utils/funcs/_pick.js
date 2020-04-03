export const _pick = path => ({
  from: (source, defaultValue) => _pickFrom(source, path, defaultValue)
})

const _pickFrom = (source, path, defaultValue = null) => {
  if (!source) return defaultValue

  const segments = path.split(".")
  let result = segments.reduce(
    (acc, segment) => (acc && acc[segment] ? acc[segment] : null),
    source
  )

  return result || defaultValue
}
