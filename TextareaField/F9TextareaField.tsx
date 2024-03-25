import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Textarea, 
    TextareaProps
} from '@fluentui/react-components'

export type F9TextareaFieldOnChangeEventHandler = (targetRef: React.RefObject<HTMLTextAreaElement>, data?: InputOnChangeData) => void;
export interface F9TextareaFieldProps extends Omit<TextareaProps, "contentBefore" | "contentAfter" | "onClick" | "onChange"> {
    fieldProps: Omit<F9FieldProps, "valueChanged">;
    isRead?: boolean;
    isControlDisabled?: boolean;
    delayOutput?: "none" | "debounce" | "onblur";
    delayTimeout?: number;
    valueUpdated: boolean;
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
        fieldProps,
        resize,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    
    const [value, setValue] = React.useState(props.value);
    
    React.useEffect(()=>{
        if(valueUpdated && props.value !== value){
            setValue(props.value);
        }
    },[props.value, valueUpdated, setValue]);

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
        onChange?.(inputRef, data);
    };

    return <F9Field 
        {...fieldProps}
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