import * as React from 'react';
import { F9Field, F9FieldProps, renderSlotAsHtml } from '../Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Input, 
    InputProps
} from '@fluentui/react-components';

export type F9InputFieldOnChangeEventHandler = (ev?: {type: string; target?: HTMLInputElement}, data?: InputOnChangeData) => void;
export interface F9InputFieldProps extends Omit<InputProps, "contentBefore" | "contentAfter" | "onClick" | "onChange"> {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    contentBefore?: string;
    contentAfter?: string;
    validate?: "onchange" | "always" | "never";
    valueUpdated: boolean;
    pendingValidation: {
        validationMessage?: F9FieldProps["validationMessage"];
        validationState?: F9FieldProps["validationState"];
    };
    onValidate?: F9FieldProps["onValidate"];
    onChange: F9InputFieldOnChangeEventHandler
}

export const F9InputField: React.FunctionComponent<F9InputFieldProps> = (props)=>{

    const {
        size,
        isControlDisabled,
        isRead,
        valueUpdated,
        contentBefore,
        contentAfter,
        onBlur,
        onChange,
        onValidate,
        fieldProps,
        validate,
        pendingValidation,
        ...restProps
    } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    const [value, setValue] = React.useState(props.value);
    const valueChangedFromDefault = React.useRef(false);
    
    React.useEffect(()=>{
        if(valueUpdated && props.value !== value){
            valueChangedFromDefault.current = false;
            setValue(props.value);
            inputRef.current &&
            onChange?.(
                {type: "change", target: inputRef.current}, 
                {value: props.value || ''}
            );
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
    
    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData)=>{
        setValue(data.value);
        const event = {...ev};
        valueChangedFromDefault.current = data.value != props.value;
        onChange?.(event, data);
    };

    return <F9Field 
        {...fieldProps}
        {...validation}
    >
        <Input
            {...restProps}
            input={inputSlot}
            onChange={onInputChange}
            onBlur={onBlur}
            value={value}
            contentBefore={contentBeforeSlot}
            contentAfter={contentAfterSlot}
            disabled={isControlDisabled}
            size={size}
            ref={inputRef}
        ></Input>
    </F9Field>
}