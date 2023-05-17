import * as React from 'react';
import { F9Field, F9FieldProps, renderSlotAsHtml } from '../Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Input, 
    InputProps
} from '@fluentui/react-components'
import { useDefaultState } from '../utils/useDefaultState';
import { useTimeout } from '../utils/useTimeout';

export type F9InputFieldOnChangeEventHandler = (ev?: {type: string; target?: HTMLInputElement}, data?: InputOnChangeData) => void;
export interface F9InputFieldProps extends Omit<InputProps, "contentBefore" | "contentAfter" | "onClick" | "onChange" | "value"> {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    contentBefore?: string;
    contentAfter?: string;
    delayOutput?: "none" | "debounce" | "onblur";
    delayTimeout?: number;
    onChange: F9InputFieldOnChangeEventHandler
}



export const F9InputField: React.FunctionComponent<F9InputFieldProps> = (props)=>{

    const {
        size,
        isControlDisabled,
        isRead,
        contentBefore,
        contentAfter,
        defaultValue,
        delayOutput,
        delayTimeout,
        onChange,
        fieldProps,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const onDefaultValueChanged = React.useCallback((newValue?: string)=>{
        inputRef.current && onChange?.(
            {type: "change", target: {...inputRef.current, value: newValue || ''}}, 
            {value: newValue || ''}
        )

    },[inputRef, inputRef.current, onChange]);

    const [value, setValue] = useDefaultState<string | undefined>({
        defaultState: defaultValue,
        onDefaultChange: onDefaultValueChanged
    });

    const inputSlot = React.useMemo(()=>{
        return isRead 
        ? {
            children: (Component: React.ElementType, inputControlProps: React.ComponentProps<'input'>)=>{
                return <Text {...(inputControlProps as TextProps)}>{value}</Text>;
             }
          } 
        : undefined
    }, [isRead, value]);

    const contentBeforeSlot = React.useMemo(()=>renderSlotAsHtml(contentBefore, 'span'),[contentBefore]);
    const contentAfterSlot = React.useMemo(()=>renderSlotAsHtml(contentAfter, 'span'),[contentAfter]);
    
    const [setInputTimeout, clearInputTimeout] = useTimeout();
    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData)=>{
        setValue(data.value);
        
        const event = {...ev};
        switch(delayOutput){
            case "onblur":
                break;
            case "debounce":
                clearInputTimeout();
                setInputTimeout(()=>onChange?.(event, data), delayTimeout || 0);
                break;
            default:
                onChange?.(ev, data);
        }
    };

    const onInputBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback((ev)=>{
        if(delayOutput == "onblur"){
            onChange?.(ev, {value: value ?? ""})
        }
    },[delayOutput, value]);

    return <F9Field {...fieldProps}
    >
        <Input
            {...restProps}
            input={inputSlot}
            onChange={onInputChange}
            onBlur={onInputBlur}
            value={value}
            contentBefore={contentBeforeSlot}
            contentAfter={contentAfterSlot}
            disabled={isControlDisabled}
            size={size}
            ref={inputRef}
        ></Input>
    </F9Field>
}