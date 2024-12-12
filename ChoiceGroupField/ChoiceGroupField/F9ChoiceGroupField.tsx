import * as React from 'react';
import { F9Field, F9FieldProps } from '../../Field/Field/F9Field';
import { F9SimpleOption } from '../../Utilities/simpleOption';
import { 
    Text,
    RadioGroup,
    RadioGroupProps,
    Radio,
    InputOnChangeData, 
    Checkbox,
    makeStyles,
    mergeClasses,
    CheckboxProps,
    RadioProps
} from '@fluentui/react-components';

export type F9InputFieldOnChangeEventHandler = (ev?: {type?: string; target?: HTMLInputElement}, data?: InputOnChangeData) => void;

export type F9ChoiceGroupFieldOnChangeEventHandler = (
    targetRef: React.RefObject<HTMLDivElement>, 
    newSelectedOptions: string[]
) => void;

export interface F9ChoiceGroupFieldProps extends Omit<RadioGroupProps, "onClick" | "onChange" | "value" > {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    multiselect?: boolean;
    options?: F9SimpleOption<CheckboxProps & RadioProps>[];
    selectedOptions?: string[];
    controlHeight?: number | "auto";
    controlWidth?: number | "auto";
    onChange?: F9ChoiceGroupFieldOnChangeEventHandler;
}

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }

const useStyles = makeStyles({
    root: {
        display:"flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifySelf: "stretch"
    },
    vertical: {
        flexDirection: "column"
    },
    manualControlHeight: {
        overflowY: "auto"
    },
    manualControlWidth: {
        overflowX: "auto",
        overflowY: "hidden"
    }
});

export const F9ChoiceGroupField: React.FunctionComponent<F9ChoiceGroupFieldProps> = (props)=>{

    const {
        fieldProps,
        isRead,
        isControlDisabled,
        multiselect,
        layout,
        options,
        onChange,
        controlHeight,
        controlWidth,
        style,
        className,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLDivElement>(null);

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(props.selectedOptions ?? []);
    React.useEffect(()=>{
        setSelectedOptions(props.selectedOptions ?? [])
    },[props.selectedOptions]);

    const onSelectionChange = ( ev: React.FormEvent<HTMLDivElement>, selectedValue: string ) => {
        if(isRead || isControlDisabled){
            ev.preventDefault();
            setSelectedOptions(selectedOptions);
        } else {
            const newSelectedOptions = 
                multiselect 
                ?
                    selectedOptions?.includes(selectedValue) 
                    ? selectedOptions.filter(selectedOption => selectedOption != selectedValue)
                    : [...(selectedOptions || []), selectedValue]
                :
                    selectedOptions?.includes(selectedValue)
                    ? []
                    : [selectedValue];
                    
            onChange?.(inputRef, newSelectedOptions);
        }
    };
    
    const styles = useStyles();
    
    const controlStyle = React.useMemo(()=>{
        const _style: React.CSSProperties = {};
        if(controlWidth !== null && controlWidth !== undefined && controlWidth !== "auto")
            _style.width = controlWidth;
        if(controlHeight !== null && controlHeight !== undefined && controlHeight !== "auto")
            _style.height = controlHeight;
        return _style
    },[controlWidth, controlHeight]);

    return <F9Field
        {...fieldProps}
        style={{justifyContent: "stretch"}}
    >
        {
            isRead
            ? (controlProps: any) => (
                <Text {...controlProps}
                    className={mergeClasses(controlProps.className, className)}
                    style={{...controlProps.style, ...style, ...controlStyle}}
                >
                    {
                        options?.filter((o) => selectedOptions.includes(o.Value))
                            .map((o) => o.Text ?? o.Value)
                            .join("; ")
                        }
                </Text>
            )
            : multiselect
            ? 
                (controlProps: any) => (
                    <div 
                    ref={inputRef}
                        {...controlProps} 
                        className={
                            mergeClasses(
                                "fui-CheckboxGroup", 
                                controlProps.className, 
                                styles.root, 
                                layout === "vertical" 
                                    && styles.vertical,
                                controlHeight !== null 
                                    && controlHeight != undefined 
                                    && controlHeight !== "auto" 
                                    && styles.manualControlHeight,
                                controlWidth !== null 
                                    && controlWidth != undefined 
                                    && controlWidth !== "auto" 
                                    && styles.manualControlWidth
                            )
                        }
                        style={{...controlProps.style, ...style, ...controlStyle}}>
                        {
                            options?.map((option) =>{
                                return <Checkbox 
                                required={false} 
                                key={option.Value}
                                value={option.Value}
                                label={option.Text ?? option.Value}
                                size={fieldProps.size == "large" ? "large" : "medium"}
                                checked={selectedOptions?.includes(option.Value)}
                                onChange={(ev)=>{onSelectionChange(ev, option.Value)}}
                                disabled={isControlDisabled}
                                {...option.Props} />
                            })
                        }
                    </div>
                )
            : 
                <RadioGroup
                    {...restProps}
                    style={{...style, ...controlStyle}}
                    className={
                        mergeClasses(
                            className,
                            styles.root, 
                            layout === "vertical" 
                                && styles.vertical,
                            controlHeight !== null 
                                && controlHeight != undefined 
                                && controlHeight !== "auto" 
                                && styles.manualControlHeight,
                            controlWidth !== null 
                                && controlWidth != undefined 
                                && controlWidth !== "auto" 
                                && styles.manualControlWidth
                        )
                    }
                    value={selectedOptions?.[0]}
                    onChange={(ev, data)=>{ onSelectionChange(ev, data.value)}}
                    disabled={isControlDisabled}
                    ref={inputRef}
                    layout={layout}
                >
                    {   
                        options?.map((option) => {
                            return <Radio 
                                key={option.Value}
                                value={option.Value} 
                                label={option.Text ?? option.Value}
                                {...option.Props}
                                />
                        })
                    }
                </RadioGroup>
        }
    </F9Field>
}