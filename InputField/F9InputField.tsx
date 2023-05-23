import * as React from 'react';
import { F9Field, F9FieldProps, renderSlotAsHtml } from '../Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Input, 
    InputProps,
    makeStyles
} from '@fluentui/react-components';
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


const inputFieldStyles = makeStyles({
    root: {
        flexGrow: "1"
    }
})
export const F9InputField: React.FunctionComponent<F9InputFieldProps> = (props)=>{

    const {
        size,
        isControlDisabled,
        isRead,
        defaultValue,
        contentBefore,
        contentAfter,
        delayOutput,
        delayTimeout,
        onChange,
        fieldProps,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const isTyping = React.useRef(false);
    const [value, setValue] = React.useState(defaultValue);
    const [setDefaultValueTimeout, clearDefaultValueTimeout] = useTimeout();
    React.useEffect(()=>{
        clearDefaultValueTimeout();
        setDefaultValueTimeout(()=>{
                setValue(defaultValue);
                inputRef.current && onChange?.(
                    {type: "change", target: {...inputRef.current, value: defaultValue || ''}}, 
                    {value: defaultValue || ''}
                )
            }, delayTimeout || 300
        );/*
        if(!isTyping.current){
            setValue(defaultValue);
            inputRef.current && onChange?.(
                {type: "change", target: {...inputRef.current, value: defaultValue || ''}}, 
                {value: defaultValue || ''}
            )
        }*/
    },[defaultValue])

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
    
    const [setIsTypingTimeout, clearIsTypingTimeout] = useTimeout();
    const [setInputTimeout, clearInputTimeout] = useTimeout();
    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData)=>{
        /*isTyping.current = true
        clearIsTypingTimeout();
        setIsTypingTimeout(()=>{isTyping.current = false}, 300);
        */
        clearDefaultValueTimeout();
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