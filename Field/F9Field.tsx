import * as React from 'react';
import { Field, FieldProps, LabelProps, makeStyles } from '@fluentui/react-components';
import { InfoLabel } from '@fluentui/react-components/unstable';
import * as DOMPurify from 'dompurify';
import useScrollSize, { ScrollSize } from '../utils/useScrollSize';

export interface F9FieldProps extends Omit<FieldProps, "hint" | "label" | "info" | "validationMessage"> {
    info?: string;
    label?: string;
    hint?: string;
    validationMessage?: string;
    onResize: (size?: ScrollSize, fieldRef?: React.MutableRefObject<null>) => void
}

export const renderSlotAsHtml = (rawHtml?: string, El: React.ElementType = "div") => {
    return rawHtml && rawHtml !== "" ? <El dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(rawHtml)}}/> : undefined;
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        alignContent: "flex-start"
    }
});

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

    const fieldRef = React.useRef(null);
    const scrollSize = useScrollSize(fieldRef);

    const validationMessageSlot = React.useMemo(() => {
        return renderSlotAsHtml(validationMessage, 'span')
    },[validationMessage]);
    
    React.useEffect(()=>{
        fieldRef && scrollSize?.height && scrollSize?.width && onResize?.(scrollSize, fieldRef);
    }, [scrollSize, scrollSize?.height, scrollSize?.width, fieldRef]);

    const styles = useStyles();
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
        className={styles.root}
    />
}