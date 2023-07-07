/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import * as React from 'react'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useLatest from '@react-hook/latest'

/**
 * A React hook that fires a callback whenever Mutation Observer detects a subscribed change.
 *
 * @param target A React ref created by `useRef()` or an HTML element
 * @param callback Invoked with a single `MutationRecord` any time
 *   the `target` us mutated
 */
function useMutationObserver<T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  callback: UseMutationObserverCallback,
  options: any
): MutationObserver {
  const mutationObserver = getMutationObserver();
  const storedCallback = useLatest(callback);

  useLayoutEffect(() => {
    let didUnsubscribe = false;
    const targetEl = target && 'current' in target ? target.current : target;
    if (!targetEl) return () => {};

    function cb(entry: MutationRecord, observer: MutationObserver) {
      if (didUnsubscribe) return;
      storedCallback.current(entry, observer);
    }

    mutationObserver.subscribe(targetEl as HTMLElement, cb, options);

    return () => {
      didUnsubscribe = true;
      mutationObserver.unsubscribe(targetEl as HTMLElement, cb);
    }
  }, [target, mutationObserver, storedCallback]);
  return mutationObserver.observer;
}

function createMutationObserver() {
  let ticking = false;
  let allEntries: MutationRecord[] = [];

  const callbacks: Map<any, Array<UseMutationObserverCallback>> = new Map();

  const observer = new MutationObserver(
    (mutationList: MutationRecord[], obs: MutationObserver) => {
      allEntries = allEntries.concat(mutationList);
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const triggered = new Set<Node>();
          for (let i = 0; i < allEntries.length; i++) {
            if (triggered.has(allEntries[i].target)) continue;
            triggered.add(allEntries[i].target);
            const cbs = callbacks.get(allEntries[i].target);
            cbs?.forEach((cb) => cb(allEntries[i], obs));
          }
          allEntries = [];
          ticking = false;
        })
      }
      ticking = true;
    }
  )

  return {
    observer,
    subscribe(target: HTMLElement, callback: UseMutationObserverCallback, options?: any) {
      observer.observe(target, options);
      const cbs = callbacks.get(target) ?? [];
      cbs.push(callback);
      callbacks.set(target, cbs);
    },
    unsubscribe(target: HTMLElement, callback: UseMutationObserverCallback) {
      const cbs = callbacks.get(target) ?? []
      if (cbs.length === 1) {
        callbacks.delete(target);
        if(callbacks.size === 0) observer.disconnect();
        return;
      }
      const cbIndex = cbs.indexOf(callback);
      if (cbIndex !== -1) cbs.splice(cbIndex, 1);
      callbacks.set(target, cbs);
    },
  }
}

let _mutationObserver: ReturnType<typeof createMutationObserver>;

const getMutationObserver = () =>
  !_mutationObserver
    ? (_mutationObserver = createMutationObserver())
    : _mutationObserver;

export type UseMutationObserverCallback = (
  entry: MutationRecord,
  observer: MutationObserver
) => any;

export default useMutationObserver;