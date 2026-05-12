import * as React from 'react';
import { F9Field, F9FieldProps } from '../../Field/Field/F9Field'
import { 
    Text, 
    TextProps, 
    InputOnChangeData, 
    Textarea, 
    TextareaProps,
    makeStyles,
    mergeClasses
} from '@fluentui/react-components'

export type F9TextareaFieldOnChangeEventHandler = (targetRef: React.RefObject<HTMLTextAreaElement>, data?: InputOnChangeData) => void;
export interface F9TextareaFieldProps extends Omit<TextareaProps, "contentBefore" | "contentAfter" | "onClick" | "onChange"> {
    fieldProps: Omit<F9FieldProps, "valueChanged">;
    isRead?: boolean;
    isControlDisabled?: boolean;
    delayOutput?: "none" | "debounce" | "onblur";
    delayTimeout?: number;
    valueUpdated: boolean;
    controlWidth?: number | "auto";
    controlHeight?: number | "auto";
    onChange: F9TextareaFieldOnChangeEventHandler
}

const useStyles = makeStyles({
    autoControlWidth: {
        justifyContent: 'stretch'
    }
});

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
        controlWidth,
        controlHeight,
        style,
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
        const calcStyle: React.CSSProperties = {};
        if(controlWidth && controlWidth !== "auto")
            calcStyle.width = controlWidth;
        if(controlHeight && controlHeight !== "auto")
            calcStyle.height = controlHeight;

        return isRead 
        ? {
            children: (Component: React.ElementType, inputControlProps: React.ComponentProps<'textarea'>)=>{
                return <Text 
                    {...(inputControlProps as TextProps)} 
                    style={calcStyle}>
                        {value}
                </Text>;
             }
          } 
        : { style: calcStyle}
    }, [isRead, value, controlWidth, controlHeight]);

    const controlStyle: React.CSSProperties = {
        ...style,
        alignSelf: "flex-start"
    };

    if(fieldProps.orientation !== "horizontal" && (!controlWidth || controlWidth == "auto"))
        controlStyle.width = "100%";
    
    const onInputChange = (ev: React.ChangeEvent<HTMLTextAreaElement>, data: InputOnChangeData)=>{
        setValue(data.value);
        onChange?.(inputRef, data);
    };
    
    const classNames = useStyles();
    const isAutoWidth = (resize !== "both" && resize !== "horizontal")

    return <F9Field
        {...fieldProps}
        className={mergeClasses(isAutoWidth && classNames.autoControlWidth, fieldProps.className)}
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
                style={controlStyle}
            ></Textarea>
        }
    </F9Field>
}