import { Storage } from 'aws-amplify'
import { getFileExtension } from './getFileExtension'
export const uploadFileToBucket = async (file, prefix, level = 'public') => {
  try {
    const extension = getFileExtension(file.name)
    const [name] = file.name.split(`.${extension}`)
    const fileName = `${name.replace(/(\W)/g, '_')}.${extension}`

    const response = await Storage.put(`/${prefix}/${fileName}`, file, {
      contentType: file.type,
      customPrefix: {
        public: 'org'
      },
      level
    })
    return response
  } catch (err) {
    console.error(
      `* Unexpected error caught while uploading file ${file?.name ??
        'unknown'}`,
      err
    )
  }
}

export const parallelUploadFileToBucket = (
  fileArray,
  prefix,
  level = 'public'
) => Promise.all(fileArray.map(file => uploadFileToBucket(file, prefix, level)))
