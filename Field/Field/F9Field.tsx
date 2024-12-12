import * as React from 'react';
import { Field, FieldProps, InfoLabel, Label, LabelProps, PopoverSurface, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import * as DOMPurify from 'dompurify';
import useScrollSize, { ScrollSize } from '../../Utilities/useScrollSize';

export interface F9FieldProps extends Omit<FieldProps, "hint" | "label" | "info" | "validationMessage"> {
    info?: string;
    label?: string;
    labelFont?: string;
    labelFontSize?: string;
    labelFontWeight?: string;
    labelFontColor?: string;
    labelWrap?: "wrap" | "nowrap" | "balance" | "pretty";
    labelWidth?: number | "auto";
    labelAlign?: "start" | "end" | "center" | "justify";
    hint?: string;
    validationMessage?: string;
    allocatedHeight?: number;
    allocatedWidth?: number;
    onResize: (size?: ScrollSize, fieldRef?: React.MutableRefObject<null>) => void
}

const useStyles = makeStyles({
    root: {
        alignItems: "start",
        justifyItems: "start",
        alignContent: "start",
        justifyContent: "start"
    },
    /* horizontalLabel: {
        gridRowEnd: "inherit"
    }, */
    horizontalOtherNoLabel: {
        gridColumnStart: 1
    },
    horizontalOtherWithLabel: {
        gridColumnStart: 2
    },
    horizontalFirstRow: {
        gridRowStart: 1
    },
    horizontalSecondRow: {
        gridRowStart: 2
    },
    horizontalThirdRow: {
        gridRowStart: 3
    }
});

export const renderSlotAsHtml = (rawHtml?: string, El: React.ElementType = "div", props?: any) => {
    if(rawHtml === undefined || rawHtml === null || rawHtml === "")
        return;

    return (<El 
            {...props}
            dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(rawHtml)}}/>
    )
};

export const F9Field: React.FunctionComponent<F9FieldProps> = (props)=>{

    const {
        label,
        labelFont,
        labelFontSize,
        labelFontWeight,
        labelFontColor,
        labelWidth,
        labelAlign,
        labelWrap,
        info,
        hint,
        required,
        validationMessage,
        validationState,
        orientation,
        size,
        allocatedHeight,
        allocatedWidth,
        onResize,
        onClick,
        style,
        className,
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
        if(labelWidth !== undefined 
            && labelWidth !== null 
            && labelWidth !== "auto"){
            calcStyles.width = labelWidth
        }
        return calcStyles;
    },[labelFont, labelFontSize, labelFontWeight, labelFontColor, labelWidth, labelAlign, labelWrap, orientation]);
    
    const labelSlot = React.useMemo(()=>{
        return {
            children: (_: React.ElementType, labelProps: LabelProps)=>{
                if(info){
                    return <InfoLabel 
                        {...labelProps} 
                        label={{style: labelStyles}} 
                        infoButton={{style: labelStyles}}
                        info={<PopoverSurface><div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(info)}}/></PopoverSurface>}
                    >{label}</InfoLabel>
                } else if (label) {
                    return <Label 
                        {...labelProps} 
                        style={labelStyles}
                    >{label}</Label>
                }
                return;
            }
        }
    },[orientation, label, info, labelStyles]);
    
    const styles = useStyles();

    const hintSlot = React.useCallback((El: React.Component, slotProps: any)=>{
        if(hint === undefined || hint === null || hint === "")
            return;

        const classNames = orientation === "horizontal"
            ? mergeClasses(
                slotProps.className, 
                label ? styles.horizontalOtherWithLabel : styles.horizontalOtherNoLabel,
                props.children && validationMessage 
                    ? styles.horizontalThirdRow 
                    : props.children || validationMessage
                    ? styles.horizontalSecondRow
                    : styles.horizontalFirstRow
            )
            : slotProps.className;

        return renderSlotAsHtml(
            hint, 
            "div", 
            {...slotProps, className: classNames}
        )
    },[orientation, label, hint, validationMessage]);

    const validationMessageSlot = React.useCallback((Comp: React.ElementType, slotProps: any)=>{
        if(validationMessage === undefined || validationMessage === null || validationMessage === "")
            return;
        
        const classNames = orientation === "horizontal"
            ? mergeClasses(
                slotProps.className, 
                label ? styles.horizontalOtherWithLabel : styles.horizontalOtherNoLabel,
                props.children ? styles.horizontalSecondRow : styles.horizontalFirstRow
            )
            : slotProps.className;

        const {
            children,
            ...otherProps
        } = slotProps;

        return (<Comp {...otherProps} className={classNames}>
            {children}
            {renderSlotAsHtml(validationMessage, 'span')}
        </Comp>)
    },[label, orientation, validationMessage]);

    const fieldRef = React.useRef(null);
    const scrollSize = useScrollSize(fieldRef);
    
    React.useEffect(()=>{
        fieldRef && scrollSize?.height && scrollSize?.width && onResize?.(scrollSize, fieldRef);
    }, [scrollSize, scrollSize?.height, scrollSize?.width, fieldRef]);

    const gridTemplateColumns = React.useMemo(()=>{
        if(orientation === "horizontal"){
            if(label === "" || label === undefined || label === null)
                return "1fr";
            const cleanWidth = 
                !labelWidth || labelWidth === "auto"
                ? "33%"
                : "auto" 
            return `${cleanWidth} 1fr`
        }
        return;
    },[label, labelWidth, orientation]);

    const fieldStyle:React.CSSProperties = { ...style };
    if(allocatedWidth)
        fieldStyle.width = allocatedWidth;
    if(allocatedHeight)
        fieldStyle.maxHeight = allocatedHeight;
    if(gridTemplateColumns) 
        fieldStyle.gridTemplateColumns = gridTemplateColumns;
    
    const classNames = mergeClasses(styles.root, className);

    return <Field
        {...restProps}
        label={labelSlot}
        hint={{ children: hintSlot}}
        required={required}
        validationMessage={{ children: validationMessageSlot}}
        validationState={validationState}
        orientation={orientation}
        size={size}
        ref={fieldRef}
        style={fieldStyle}
        className={classNames}
        onClick={onClick}
    />
}