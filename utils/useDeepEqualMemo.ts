import { useRef } from 'react';
import * as isDeepEqual from 'fast-deep-equal/react';
export function useDeepEqualMemo<T>(value: T extends any ? T | (() => T) : never) {
  const ref = useRef<T | undefined>(undefined);

  const newValue = typeof value === 'function' ? value(ref.current) : value;
  if (!isDeepEqual(ref.current, newValue)) {
    ref.current = newValue
  }
  
  return ref.current
}