import * as React from 'react';
import { Field, FieldProps, LabelProps } from '@fluentui/react-components';
import { InfoLabel } from '@fluentui/react-components/unstable';
import * as DOMPurify from 'dompurify';
import useScrollSize, { ScrollSize } from '../utils/useScrollSize';

export interface F9FieldOnValidateData {
    validationMessage?: string;
    validationState?: "error" | "success" | "none" | "warning";
}

export type F9FieldOnValidateEventHandler = (
    event: {type: "validate", target: HTMLElement},
    validationData: F9FieldOnValidateData
) => void;

export interface F9FieldProps extends Omit<FieldProps, "hint" | "label" | "info"> {
    info?: string;
    label?: string;
    hint?: string;
    validate?: "onchange" | "always" | "never";
    valueChanged: boolean;
    pendingValidation: {
        validationMessage?: string;
        validationState?: FieldProps["validationState"];
    };
    onResize: (size?: ScrollSize, fieldRef?: React.MutableRefObject<null>) => void,
    onValidate?: F9FieldOnValidateEventHandler
}

export const renderSlotAsHtml = (rawHtml?: string, El: React.ElementType = "div") =>
    rawHtml && <El dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(rawHtml)}}/>

export const F9Field: React.FunctionComponent<F9FieldProps> = (props)=>{

    const {
        label,
        info,
        hint,
        required,
        validate,
        valueChanged,
        pendingValidation,
        orientation,
        size,
        onResize,
        onClick,
        onValidate,
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

    const fieldRef = React.useRef(null);
    const scrollSize = useScrollSize(fieldRef);

    const validation = React.useMemo(()=>{
        if(
            validate == "always" ||
            (validate == "onchange" && valueChanged)
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
        valueChanged,
        validate
    ]);

    React.useEffect(()=>{
        fieldRef.current 
        && onValidate?.({type: "validate", target: fieldRef.current}, validation)
    },[validation]);

    const validationMessageSlot = React.useMemo(() => {
        return renderSlotAsHtml(validation.validationMessage, 'span')
    },[validation.validationMessage]);

    React.useEffect(()=>{
        fieldRef && scrollSize?.height && scrollSize?.width && onResize?.(scrollSize, fieldRef);
    }, [scrollSize, scrollSize?.height, scrollSize?.width, fieldRef]);

    return <Field
        {...restProps}
        label={labelSlot}
        hint={hintSlot}
        required={required}
        validationMessage={validationMessageSlot}
        validationState={validation.validationState}
        orientation={orientation}
        size={size}
        ref={fieldRef}
        onClick={onClick}
    />
}