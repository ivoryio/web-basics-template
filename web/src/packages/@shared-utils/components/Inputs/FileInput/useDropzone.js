import { useEffect, useRef } from 'react'
import { useBoolean } from '../../../hooks/useBoolean'

export const useDropzone = (selectFiles, dropzoneRef) => {
  const [dragging, setDragging] = useBoolean(false)

  const dragCounter = useRef(0)
  useEffect(() => {
    const dropzone = dropzoneRef.current
    dropzone.addEventListener('dragenter', handleDragIn, false)
    dropzone.addEventListener('dragleave', handleDragOut, false)
    dropzone.addEventListener('dragover', preventDefaults, false)
    dropzone.addEventListener('drop', handleDrop, false)

    return () => {
      dropzone.removeEventListener('dragenter', handleDragIn, false)
      dropzone.removeEventListener('dragleave', handleDragOut, false)
      dropzone.removeEventListener('dragover', preventDefaults, false)
      dropzone.removeEventListener('drop', handleDrop, false)
    }

    function preventDefaults (ev) {
      ev.preventDefault()
      ev.stopPropagation()
    }

    function handleDrop (ev) {
      preventDefaults(ev)
      setDragging(false)
      const { files } = ev.dataTransfer
      if (files?.length > 0) {
        selectFiles(files)
        dragCounter.current = 0
        ev.dataTransfer.clearData()
      }
    }
    function handleDragIn (ev) {
      preventDefaults(ev)
      dragCounter.current += 1

      const { items } = ev.dataTransfer
      if (items?.length > 0) setDragging(true)
    }
    function handleDragOut (ev) {
      preventDefaults(ev)
      dragCounter.current -= 1
      if (dragCounter.current === 0) setDragging(false)
    }
  }, [dropzoneRef, selectFiles, setDragging])

  return {
    dragging
  }
}
