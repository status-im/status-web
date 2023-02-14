import { useRef, useState } from 'react'

interface UseImageUploadReturn {
  imagesData: string[]
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleImageRemove: (index: number) => void
  imageUploaderInputRef: React.RefObject<HTMLInputElement>
  isDisabled: boolean
}
const ALLOWED_EXTENSIONS = /(\.jpg|\.jpeg|\.png)$/i
const IMAGES_LIMIT = 6

const useImageUpload = (): UseImageUploadReturn => {
  const [imagesData, setImagesData] = useState<string[]>([])
  const imageUploaderInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files

    if (!files) {
      return
    }

    const filteredFiles = [...files].filter(file =>
      ALLOWED_EXTENSIONS.test(file.name)
    )

    // Show alert if some files have unsupported formats
    if (files.length > filteredFiles.length) {
      return alert(
        `Some files have unsupported formats. Only .jpg, .jpeg and .png formats are supported.`
      )
    }

    if (files.length > IMAGES_LIMIT || imagesData.length > IMAGES_LIMIT) {
      return alert(
        `You can upload only ${IMAGES_LIMIT} images. Please remove some files and try again.`
      )
    }

    const newImagesData: string[] = await Promise.all(
      filteredFiles.map(async file => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
        })
      })
    )

    setImagesData(prevState => [...prevState, ...newImagesData])
  }

  const handleImageRemove = (index: number) => {
    // Reset input value to trigger onChange event
    imageUploaderInputRef.current!.value = ''
    setImagesData(prevState => prevState.filter((_, i) => i !== index))
  }

  return {
    imagesData,
    handleImageUpload,
    handleImageRemove,
    imageUploaderInputRef,
    isDisabled: imagesData.length >= IMAGES_LIMIT,
  }
}

export { useImageUpload }
