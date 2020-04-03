import qs from "query-string"

export function getQueryParam (name) {
  const parsed = qs.parse(window.location.search)
  return parsed[name]
}
