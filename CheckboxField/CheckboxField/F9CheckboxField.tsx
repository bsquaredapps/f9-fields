import * as React from 'react';
import { F9Field, F9FieldProps } from '../../Field/Field/F9Field'
import { 
    CheckboxOnChangeData, 
    Checkbox, 
    CheckboxProps,
    makeStyles,
    LabelProps,
    InfoLabel,
    Label,
    mergeClasses
} from '@fluentui/react-components';
import * as DOMPurify from 'dompurify';

export type F9CheckboxFieldOnChangeEventHandler = (targetRef: React.RefObject<HTMLInputElement>, data?: CheckboxOnChangeData) => void;
export interface F9CheckboxFieldProps extends Omit<CheckboxProps, "onClick" | "onChange"> {
    fieldProps: Omit<F9FieldProps, "checkedChanged" | "label" | "info" | "required">;
    labelFont?: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    labelFontColor?: string;
    labelWrap?: "wrap" | "nowrap" | "balance" | "pretty";
    labelAlign?: "start" | "end" | "center" | "justify";
    info: F9FieldProps["info"];
    isRead?: boolean;
    isControlDisabled?: boolean;
    validate?: "onchange" | "always" | "never";
    valueUpdated: boolean;
    controlHeight?: number | "auto";
    controlWidth?: number | "auto";
    onChange: F9CheckboxFieldOnChangeEventHandler
}

const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    label: {
        flexGrow: 1
    }
});

export const F9CheckboxField: React.FunctionComponent<F9CheckboxFieldProps> = (props)=>{

    const {
        size,
        isControlDisabled,
        isRead,
        valueUpdated,
        onBlur,
        onChange,
        info,
        label,
        labelFont,
        labelFontSize,
        labelFontWeight,
        labelFontColor,
        labelAlign,
        labelWrap,
        required,
        fieldProps,
        controlHeight,
        controlWidth,
        className,
        style,
        ...restProps
    } = props;

    const labelStyles = React.useMemo(()=>{
        const calcStyles: React.CSSProperties = {};
        if(labelFont)
            calcStyles.fontFamily = labelFont;
        if(labelFontSize)
            calcStyles.fontSize = labelFontSize
        if(labelFontWeight)
            calcStyles.fontWeight = labelFontWeight;
        if(labelFontColor)
            calcStyles.color = labelFontColor;
        if(labelAlign)
            calcStyles.textAlign = labelAlign;
        if(labelWrap)
            calcStyles.textWrap = labelWrap;
        return calcStyles;
    },[labelFont, labelFontSize, labelFontWeight, labelFontColor, labelAlign, labelWrap]);

    const labelSlot = React.useMemo(()=>{
        return {
            children: (_: React.ElementType, labelProps: LabelProps)=>{
                if(info){
                    return <InfoLabel 
                        {...labelProps} 
                        label={{style: labelStyles}} 
                        infoButton={{style: labelStyles}}
                        className={mergeClasses(labelProps.className, styles.label)}
                        info={<div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(info)}}/>}>
                        {label}
                    </InfoLabel>
                }
                return <Label 
                    {...labelProps} 
                    style={labelStyles}
                    className={mergeClasses(labelProps.className, styles.label)}>
                    {label}
                </Label>
            }
        }
    },[label, info, labelStyles]);

    const inputRef = React.useRef<HTMLInputElement>(null);
    
    const [checked, setChecked] = React.useState(props.checked);
    
    React.useEffect(()=>{
        if(valueUpdated && props.checked !== checked){
            setChecked(props.checked);
        }
    },[props.checked, valueUpdated, setChecked]);

    const styles = useStyles();

    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData)=>{
        if(isControlDisabled || isRead){
            ev.preventDefault();
            return;
        }
        const event = {...ev};
        setChecked(data.checked);
        onChange?.(inputRef, data);
    };
    
    const controlStyle = React.useMemo(()=>{
        const _style: React.CSSProperties = {};
        if(controlWidth && controlWidth !== "auto")
            _style.width = controlWidth;
        if(controlHeight && controlHeight !== "auto")
            _style.height = controlHeight;
        return _style
    },[controlWidth, controlHeight]);

    return <F9Field 
        {...fieldProps}
    >
        <Checkbox
            {...restProps}
            label={labelSlot}
            required={required}
            className={mergeClasses(className, styles.root)}
            style={{...style, ...controlStyle}}
            readOnly={isRead}
            onChange={onInputChange}
            onBlur={onBlur}
            checked={checked}
            disabled={isControlDisabled}
            size={size}
            ref={inputRef}
        ></Checkbox>
    </F9Field>
}