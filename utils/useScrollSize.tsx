import * as React from 'react'
import useResizeObserver from './useResizeObserver'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useMutationObserver from './useMutationObserver'

/**
 * A React hook for measuring the scrollSize of HTML elements including when they or their children change
 *
 * @param target A React ref created by `useRef()` or an HTML element
 * @param options Configures the initial width and initial height of the hook's state
 */

export interface ScrollSize {
  height: number;
  width: number;
}

const calculateContentSize = (target: HTMLElement) => {
  const style = getComputedStyle(target);
  const targetX = target.offsetLeft;
  const targetY = target.offsetTop;

  const elementBoxHeight = target.offsetHeight - target.clientHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const elementBoxWidth = target.offsetWidth - target.clientWidth + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  let height = elementBoxHeight;
  let width = elementBoxWidth;

  for(let i = 0; i < target.children.length; i++){
    const child = target.children[i] as HTMLElement;
    height = Math.max(height, elementBoxHeight + child.offsetTop + child.offsetHeight);
    width = Math.max(width, elementBoxWidth + child.offsetLeft + child.offsetWidth);
  }
  return { width, height }
}
const useScrollSize = <T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options?: UseSizeOptions
): ScrollSize => {
  const [size, setSize] = React.useState<{ height: number, width: number }>(() => {
    const targetEl = target && 'current' in target ? target.current : target
    const size = { width: options?.initialWidth ?? 0, height: options?.initialHeight ?? 0 };
    if(targetEl){
      return calculateContentSize(targetEl)
    }
    return { width: options?.initialWidth ?? 0, height: options?.initialHeight ?? 0 }
  })



  // Where the magic happens
  const resizeObserver = useResizeObserver(target, (entry) => {
    const target = entry.target as HTMLElement
    setSize({ width: target.scrollWidth, height: target.scrollHeight })
  });

  const childTrigger = React.useCallback(() => {
    const targetEl = target && 'current' in target ? target.current : target;
    if (targetEl) {
      //setSize({ width: targetEl.scrollWidth, height: targetEl.scrollHeight })
      setSize(calculateContentSize(targetEl));
    }
  }, [target, setSize])

  useLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return
    //setSize({ width: targetEl.scrollWidth, height: targetEl.scrollHeight });
    setSize(calculateContentSize(targetEl));
    targetEl.childNodes.forEach((node)=>{
      resizeObserver.subscribe(node as HTMLElement, childTrigger)
    })
  }, [target])

  //Additional magic for tracking children
  //const childObservers = React.useRef<Map<Node, ReturnType<typeof useResizeObserver>>>(new Map());
  useMutationObserver(target, (mutation, observer) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        resizeObserver.subscribe(node as HTMLElement, childTrigger)
      });
      mutation.removedNodes.forEach((node) => {
        resizeObserver.unsubscribe(node as HTMLElement, childTrigger)
      });
      childTrigger();
    }
  }, { childList: true })

  return size
}

export interface UseSizeOptions {
  // The initial width to set into state.
  // This is useful for SSR environments.
  initialWidth: number
  // The initial height to set into state.
  // This is useful for SSR environments.
  initialHeight: number
}

export default useScrollSize