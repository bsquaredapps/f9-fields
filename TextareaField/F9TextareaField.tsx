import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Textarea, 
    TextareaProps
} from '@fluentui/react-components'

export type F9TextareaFieldOnChangeEventHandler = (ev?: {type: string; target?: HTMLTextAreaElement}, data?: InputOnChangeData) => void;
export interface F9TextareaFieldProps extends Omit<TextareaProps, "contentBefore" | "contentAfter" | "onClick" | "onChange"> {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    delayOutput?: "none" | "debounce" | "onblur";
    delayTimeout?: number;
    validate?: "onchange" | "always" | "never";
    valueUpdated: boolean;
    pendingValidation: {
        validationMessage?: F9FieldProps["validationMessage"];
        validationState?: F9FieldProps["validationState"];
    };
    onValidate?: F9FieldProps["onValidate"];
    onChange: F9TextareaFieldOnChangeEventHandler
}

export const F9TextareaField: React.FunctionComponent<F9TextareaFieldProps> = (props)=>{

    const {
        size,
        isControlDisabled,
        isRead,
        valueUpdated,
        delayOutput,
        delayTimeout,
        onBlur,
        onChange,
        onValidate,
        fieldProps,
        validate,
        pendingValidation,
        resize,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    
    const [value, setValue] = React.useState(props.value);
    const valueChangedFromDefault = React.useRef(false);
    
    React.useEffect(()=>{
        if(valueUpdated && props.value !== value){
            valueChangedFromDefault.current = false;
            setValue(props.value);
        }
    },[props.value, valueUpdated, setValue]);

    const validation = React.useMemo(()=>{
        if(
            validate == "always" ||
            (validate == "onchange" && valueChangedFromDefault.current)
        ){
            if(!pendingValidation.validationMessage){
                pendingValidation.validationState = "none"
            }
            if(!pendingValidation.validationState){
                pendingValidation.validationState = "error"
            }
            return pendingValidation;
        } else {
            return {
                validationMessage: "",
                validationState: "none"
            } as typeof pendingValidation
        }
    }, [
        pendingValidation.validationMessage,
        pendingValidation.validationState,
        valueChangedFromDefault.current, 
        validate
    ]);

    React.useEffect(()=>{
        inputRef.current 
        && onValidate?.({type: "validate", target: inputRef.current}, validation)
    },[validation]);

    const textareaSlot = React.useMemo(()=>{
        return isRead 
        ? {
            children: (Component: React.ElementType, inputControlProps: React.ComponentProps<'textarea'>)=>{
                return <Text {...(inputControlProps as TextProps)}>{value}</Text>;
             }
          } 
        : undefined
    }, [isRead, value]);

    const onInputChange = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: InputOnChangeData)=>{
        setValue(data.value);
        const event = {...ev};
        valueChangedFromDefault.current = data.value != props.value;
        onChange?.(event, data);
    };

    return <F9Field 
        {...fieldProps}
        {...validation}
    >
        {
            isRead 
            ? (props) => <Text {...props}>{value}</Text>
            : <Textarea
                {...restProps}
                resize={resize}
                textarea={textareaSlot}
                onChange={onInputChange}
                onBlur={onBlur}
                value={value}
                disabled={isControlDisabled}
                size={size}
                ref={inputRef}
            ></Textarea>
        }
    </F9Field>
}