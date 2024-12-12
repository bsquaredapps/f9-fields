import * as React from 'react';
import { F9Field, F9FieldProps, renderSlotAsHtml } from '../../Field/Field/F9Field'
import { 
    Text,
    TextProps, 
    InputOnChangeData, 
    Input, 
    InputProps,
    makeStyles,
    mergeClasses
} from '@fluentui/react-components';

export type F9InputFieldOnChangeEventHandler = (targetRef: React.RefObject<HTMLInputElement>, data?: InputOnChangeData) => void;
export interface F9InputFieldProps extends Omit<InputProps, "contentBefore" | "contentAfter" | "onClick" | "onChange"> {
    fieldProps: Omit<F9FieldProps, "valueChanged">;
    isRead?: boolean;
    isControlDisabled?: boolean;
    contentBefore?: string;
    contentAfter?: string;
    validate?: "onchange" | "always" | "never";
    valueUpdated: boolean;
    controlHeight?: number | "auto";
    controlWidth?: number | "auto";
    onChange: F9InputFieldOnChangeEventHandler
}

const useStyles = makeStyles({
    root: {
        //width: "100%"
    }
});

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
        controlHeight,
        controlWidth,
        style,
        className,
        ...restProps
    } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    const [value, setValue] = React.useState(props.value);
    
    React.useEffect(()=>{
        if(valueUpdated && props.value !== value){
            setValue(props.value);
        }
    },[props.value, valueUpdated, setValue]);

    const styles = useStyles();
    const inputSlot = React.useMemo(()=>{
        return isRead 
        ? {
            children: (Component: React.ElementType, inputControlProps: React.ComponentProps<'input'>)=>{
                return <Text {...(inputControlProps as TextProps)} >{value}</Text>;
             }
          } 
        : { className: styles.root }
    }, [isRead, value, controlWidth, controlHeight]);

    const contentBeforeSlot = React.useMemo(()=>renderSlotAsHtml(contentBefore, 'span'),[contentBefore]);
    const contentAfterSlot = React.useMemo(()=>renderSlotAsHtml(contentAfter, 'span'),[contentAfter]);
    
    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData)=>{
        const event = {...ev};
        setValue(data.value);
        onChange?.(inputRef, data);
    };
    
    const controlStyle = React.useMemo(()=>{
        const _style: React.CSSProperties = {};
        if(controlWidth && controlWidth !== "auto"){
            _style.width = controlWidth;
        } else {
            _style.width = fieldProps.allocatedWidth
        }
            
        if(controlHeight && controlHeight !== "auto")
            _style.height = controlHeight;
        return _style
    },[controlWidth, controlHeight, fieldProps.allocatedWidth]);

    return <F9Field 
        {...fieldProps}
    >
        <Input
            {...restProps}
            className={mergeClasses(styles.root, className)}
            input={inputSlot}
            onChange={onInputChange}
            onBlur={onBlur}
            value={value}
            contentBefore={contentBeforeSlot}
            contentAfter={contentAfterSlot}
            disabled={isControlDisabled}
            size={size}
            ref={inputRef}
            style={{...controlStyle, ...style}}
        ></Input>
    </F9Field>
}