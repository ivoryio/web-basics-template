export const getFileExtension = path =>
  path.match(/(?:.+..+[^/]+$)/gi) != null
    ? path.split(".").slice(-1)[0]
    : "null"
