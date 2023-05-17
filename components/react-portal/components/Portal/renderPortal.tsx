import { createPortal } from 'react-dom';
import * as React from 'react';
import type { PortalState } from './Portal.types';

/**
 * Render the final JSX of Portal
 */
export const renderPortal_unstable = (state: PortalState): React.ReactElement => {
  return (
    <span hidden ref={state.virtualParentRootRef}>
      {state.mountNode && createPortal(state.children, state.mountNode)}
    </span>
  );
};
