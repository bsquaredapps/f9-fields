import * as React from 'react';
import { F9Field, F9FieldProps, renderSlotAsHtml } from '../Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Textarea, 
    TextareaProps
} from '@fluentui/react-components'
import { useDefaultState } from '../utils/useDefaultState';
import { useTimeout } from '../utils/useTimeout';

export type F9TextareaFieldOnChangeEventHandler = (ev?: {type: string; target?: HTMLTextAreaElement}, data?: InputOnChangeData) => void;
export interface F9TextareaFieldProps extends Omit<TextareaProps, "contentBefore" | "contentAfter" | "onClick" | "onChange" | "value"> {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    delayOutput?: "none" | "debounce" | "onblur";
    delayTimeout?: number;
    onChange: F9TextareaFieldOnChangeEventHandler
}



export const F9TextareaField: React.FunctionComponent<F9TextareaFieldProps> = (props)=>{

    const {
        size,
        isControlDisabled,
        isRead,
        defaultValue,
        delayOutput,
        delayTimeout,
        onChange,
        fieldProps,
        resize,
        ...restProps
    } = props;

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const onDefaultValueChanged = React.useCallback((newValue?: string)=>{
        textareaRef.current && onChange?.(
            {type: "change", target: {...textareaRef.current, value: newValue || ''}}, 
            {value: newValue || ''}
        )

    },[textareaRef, textareaRef.current, onChange]);

    const [value, setValue] = useDefaultState<string | undefined>({
        defaultState: defaultValue,
        onDefaultChange: onDefaultValueChanged
    });

    const textareaSlot = React.useMemo(()=>{
        return isRead 
        ? {
            children: (Component: React.ElementType, inputControlProps: React.ComponentProps<'textarea'>)=>{
                return <Text {...(inputControlProps as TextProps)}>{value}</Text>;
             }
          } 
        : undefined
    }, [isRead, value]);

    const [setInputTimeout, clearInputTimeout] = useTimeout();
    const onInputChange = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: InputOnChangeData)=>{
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

    const onInputBlur: React.FocusEventHandler<HTMLTextAreaElement> = React.useCallback((ev)=>{
        if(delayOutput == "onblur"){
            onChange?.(ev, {value: value ?? ""})
        }
    },[delayOutput, value]);

    return <F9Field {...fieldProps}
    >
        <Textarea
            {...restProps}
            resize={resize}
            textarea={textareaSlot}
            onChange={onInputChange}
            onBlur={onInputBlur}
            value={value}
            disabled={isControlDisabled}
            size={size}
            ref={textareaRef}
        ></Textarea>
    </F9Field>
}