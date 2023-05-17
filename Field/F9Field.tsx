import * as React from 'react';
import { LabelProps } from '@fluentui/react-components';
import { Field, FieldProps } from '../components/react-field';
import { InfoLabel } from '../components/react-infobutton/InfoLabel';
import * as DOMPurify from 'dompurify';
import { ElementSize, useElementSize } from '../utils/useElementSize';

export interface F9FieldProps extends Omit<FieldProps, "validationMessage" | "hint" | "label" | "info"> {
    info?: string;
    label?: string;
    hint?: string;
    validationMessage?: string;
    onResize: (size?: ElementSize, fieldRef?: React.MutableRefObject<null>) => void
}

export const renderSlotAsHtml = (rawHtml?: string, El: React.ElementType = "div") =>
    rawHtml && <El dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(rawHtml)}}/>

export const F9Field: React.FunctionComponent<F9FieldProps> = (props)=>{

    const {
        label,
        info,
        hint,
        required,
        validationMessage,
        validationState,
        orientation,
        size,
        onResize,
        onClick,
        ...restProps
    } = props;

    const labelSlot = React.useMemo(()=>{
        return !info
        ? label
        : {
            children: (_: React.ElementType, labelProps: LabelProps)=>{
                return <InfoLabel {...labelProps} info={<div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(info)}}/>}>
                    {label}
                  </InfoLabel>
                }
          }
    },[label, info]);

    const hintSlot = React.useMemo(()=>renderSlotAsHtml(hint),[hint]);
    const validationMessageSlot = React.useMemo(()=>renderSlotAsHtml(validationMessage, 'span'),[validationMessage]);

    const fieldRef = React.useRef(null);
    const contentSize = useElementSize(fieldRef);

    React.useEffect(()=>{
        fieldRef && contentSize?.height && contentSize?.width && onResize?.(contentSize, fieldRef);
    }, [contentSize?.height, contentSize?.width, fieldRef]);

    return <Field
        {...restProps}
        label={labelSlot}
        hint={hintSlot}
        required={required}
        validationMessage={validationMessageSlot}
        validationState={validationState}
        orientation={orientation}
        size={size}
        ref={fieldRef}
        onClick={onClick}
    />
}