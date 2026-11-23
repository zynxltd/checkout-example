/**
 * EXERCISE 6 — custom hooks (Vue composables ≈ React hooks).
 * Implement these; App already imports them.
 */

import { useState } from 'react'

/** Persist state in localStorage. Vue: useStorage from VueUse. */
export function useLocalStorage(key, initialValue) {
  // TODO EXERCISE 6a
  const [value, setValue] = useState(initialValue)
  return [value, setValue]
}

/** Debounce a value (search boxes). Vue: watchDebounced. */
export function useDebouncedValue(value, delayMs = 300) {
  // TODO EXERCISE 6b — return debounced value via useEffect + setTimeout
  return value
}
