/** @jsxRuntime classic */
/** @jsx createElement */

import { createElement } from '../../../react-jsx-runtime';
import { getSlotsNext } from '../../../react-utilities/compose/getSlotsNext';
import { Portal } from '@fluentui/react-components';
import type { PopoverSurfaceSlots, PopoverSurfaceState } from './PopoverSurface.types';

/**
 * Render the final JSX of PopoverSurface
 */
export const renderPopoverSurface_unstable = (state: PopoverSurfaceState) => {
  const { slots, slotProps } = getSlotsNext<PopoverSurfaceSlots>(state);

  const surface = (
    <slots.root {...slotProps.root}>
      {state.withArrow && <div ref={state.arrowRef} className={state.arrowClassName} />}
      {slotProps.root.children}
    </slots.root>
  );

  if (state.inline) {
    return surface;
  }

  return <Portal mountNode={state.mountNode}>{surface}</Portal>;
};
