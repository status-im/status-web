// import { useParams as useParamsBase } from 'next/navigation'

type DefaultParams = {
  [key: string]: string | string[]
}

type Params = {
  ticker: string
  id: string
}

class ParamsMissingError extends Error {
  constructor() {
    super(`'params' not found props`)
  }
}

class ParamsKeyNotFoundError extends Error {
  constructor(key: string, params: string) {
    super(`'${key}' does not exist in params: ${params}.`)
  }
}

function createProxy<T extends DefaultParams>(target: T): T {
  return new Proxy(target, {
    get(target, prop: string) {
      if (target[prop] === undefined) {
        throw new ParamsKeyNotFoundError(String(prop), JSON.stringify(target))
      }

      return target[prop as keyof T]
    },
  })
}

export function params<T extends Params>(props: Record<string, any>): Params {
  if ('params' in props === false) {
    throw new ParamsMissingError()
  }

  return createProxy<T>(props['params'])
}

// export function useParams<T extends Params>(): T {
//   const params = useParamsBase<any>()
//   return createProxy<T>(params)
// }
