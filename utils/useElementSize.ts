import * as React from 'react'
import useResizeObserver from '@react-hook/resize-observer'

export interface ElementSize {
    height?: number;
    width?: number;
}

export const useElementSize = (target: React.RefObject<HTMLElement>) => {
  const [size, setSize] = React.useState<ElementSize | undefined>()

  React.useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect())
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}