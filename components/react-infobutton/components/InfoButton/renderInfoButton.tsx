/** @jsxRuntime classic */
/** @jsx createElement */

import { createElement } from '../../../react-jsx-runtime/createElement';

import { getSlotsNext } from '../../../react-utilities/compose/getSlotsNext';
import { PopoverTrigger } from '@fluentui/react-components';
import type { PopoverProps } from '@fluentui/react-components';
import type { InfoButtonState, InfoButtonSlots } from './InfoButton.types';

/**
 * Render the final JSX of InfoButton
 */
export const renderInfoButton_unstable = (state: InfoButtonState) => {
  const { slots, slotProps } = getSlotsNext<InfoButtonSlots>(state);

  return (
    <slots.popover {...(slotProps.popover as PopoverProps)}>
      <PopoverTrigger>
        <slots.root {...slotProps.root} />
      </PopoverTrigger>
      <slots.info {...slotProps.info} />
    </slots.popover>
  );
};
