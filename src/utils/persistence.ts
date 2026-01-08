import { ProrationRequest } from './models'

const STORAGE = window.localStorage ?? localStorage
const KEY = '__PRORATOR_STATE'

export const saveState = (request: ProrationRequest) => {
  STORAGE.setItem(KEY, JSON.stringify(request))
}

export const loadState = (): ProrationRequest | undefined => {
  const savedState = STORAGE.getItem(KEY)
  if (!savedState) return undefined

  const parsedState = ProrationRequest.safeParse(JSON.parse(savedState))
  if (!parsedState.success) return undefined

  return parsedState.data
}

export const clearState = () => STORAGE.removeItem(KEY)
