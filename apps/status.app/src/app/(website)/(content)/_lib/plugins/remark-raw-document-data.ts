import { type Plugin } from 'unified'

export function remarkRawDocumentData({
  path,
  dir,
}: {
  path: string
  dir: string
}): Plugin {
  return function (_, file) {
    const sourceFilePath = path.split(`/${dir}/`)[1]
    const sourceFileName = sourceFilePath.split('/').pop()
    const sourceFileDir = sourceFilePath.split('/').slice(0, -1).join('/')
    const flattenedPath = sourceFilePath.replace(/\.[^.]+$/, '')

    file.data.rawDocumentData = {
      sourceFilePath,
      sourceFileName,
      sourceFileDir,
      flattenedPath,
    }
  }
}
