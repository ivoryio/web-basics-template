/**
 * transforms a file to a base 64 string
 */
export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(",")[1])
    reader.onerror = error => reject(error)
  })
