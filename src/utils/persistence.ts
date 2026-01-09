import { ProrationRequest } from './models'

const STORAGE = window.localStorage ?? localStorage
const STORAGE_KEY = '__PRORATOR_STATE'

export const saveToLocalStorage = (data: ProrationRequest) => {
  try {
    STORAGE.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const loadFromLocalStorage = (): ProrationRequest | null => {
  try {
    const savedState = STORAGE.getItem(STORAGE_KEY)
    if (!savedState) return null

    const parsedState = ProrationRequest.safeParse(JSON.parse(savedState))
    return parsedState.success ? parsedState.data : null
  } catch (e) {
    console.warn('Failed to load from localStorage:', e)
    return null
  }
}

export const clearLocalStorage = () => {
  try {
    STORAGE.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear localStorage:', e)
  }
}
