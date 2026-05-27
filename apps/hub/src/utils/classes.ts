export type Nullable<T = any> = T | undefined | null
type ClassesArgs =
  | number
  | string
  | boolean
  | [condition: boolean, className: string]

export function classes(...args: Nullable<ClassesArgs>[]) {
  let className = ''

  const pushToClassName = (newClassName: string) => {
    className += newClassName + ' '
  }

  for (let i = 0; i < args.length; i++) {
    const element = args[i]

    if (element) {
      if (typeof element === 'string') {
        pushToClassName(element)
      } else if (Array.isArray(element)) {
        if (element[0] && element[1]) {
          pushToClassName(element[1])
        }
      }
    }
  }

  return className
}
