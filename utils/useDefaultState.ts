import * as React from 'react';
import * as isDeepEqual from 'fast-deep-equal';

export type UseDefaultStateProps<T> = {
    defaultState?: T;
    onChange?: (newState?: T) => void;
    onDefaultChange?: (newState?: T) => void;
}

export type UseDefaultState = <T>(props: UseDefaultStateProps<T>) => [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

export const useDefaultState: UseDefaultState = (props) => {
    const { defaultState, onChange, onDefaultChange } = props;

    const [state, setState] = React.useState(defaultState);


    const onChangeRef = React.useRef<typeof onChange>(undefined);
    React.useEffect(()=>{
        onChangeRef.current = onChange;
    },[onChange]);

    React.useEffect(()=>{
        onChangeRef.current?.(state);
    },[state]);

    const onDefaultChangeRef = React.useRef<typeof onDefaultChange>(undefined);
    React.useEffect(()=>{
        onDefaultChangeRef.current = onDefaultChange;
    },[onDefaultChange]);

    const defaultStateRef = React.useRef<typeof defaultState>(undefined);
    React.useEffect(()=>{
        if(!isDeepEqual(defaultState, defaultStateRef.current)){
            
            defaultStateRef.current = defaultState;
            setState(defaultState);
            onDefaultChangeRef.current?.(defaultState);
        } else {
            defaultStateRef.current = defaultState;
        }
    },[defaultState]);
    
    return [state, setState];
}