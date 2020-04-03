export function downloadURI (uri, mime, name) {
  var anchor = document.createElement("a")
  document.body.appendChild(anchor)
  anchor.style.display = "none"

  anchor.setAttribute("href", uri)
  if (mime) anchor.setAttribute("type", mime)
  if (name) anchor.setAttribute("download", name)
  anchor.click()

  document.body.removeChild(anchor)
}
