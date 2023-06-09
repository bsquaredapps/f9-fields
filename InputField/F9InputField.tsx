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
    fieldProps: Omit<F9FieldProps, "valueChanged">;
    isRead?: boolean;
    isControlDisabled?: boolean;
    contentBefore?: string;
    contentAfter?: string;
    validate?: "onchange" | "always" | "never";
    valueUpdated: boolean;
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
        fieldProps,
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
        const event = {...ev};
        valueChangedFromDefault.current = data.value != props.value;
        setValue(data.value);
        onChange?.(event, data);
    };

    return <F9Field 
        {...fieldProps}
        valueChanged={valueChangedFromDefault.current}
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