import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field';
import { F9Option } from '../components/options';
import { 
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
import { useDeepEqualMemo } from '../utils/useDeepEqualMemo';
import { arrayDifference } from '../utils/arrayDifference';

export type F9InputFieldOnChangeEventHandler = (ev?: {type?: string; target?: HTMLInputElement}, data?: InputOnChangeData) => void;

export type F9ChoiceGroupFieldOnChangeEventHandler = (
    ev: {type: string; target?: HTMLDivElement}, 
    newSelectedOptions: string[]
) => void;

export interface F9ChoiceGroupFieldProps extends Omit<RadioGroupProps, "onClick" | "onChange" | "value" > {
    fieldProps: Omit<F9FieldProps, "valueChanged">;
    isRead?: boolean;
    isControlDisabled?: boolean;
    multiselect?: boolean;
    options?: F9Option<CheckboxProps & RadioProps>[];
    selectedOptions?: string[];
    onChange?: F9ChoiceGroupFieldOnChangeEventHandler;
}

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }

const useStyles = makeStyles({
    root: {
        display:"flex",
        flexDirection: "row"
    },
    vertical: {
        flexDirection: "column"
    }
});

export const F9ChoiceGroupField: React.FunctionComponent<F9ChoiceGroupFieldProps> = (props)=>{

    const {
        fieldProps,
        isRead,
        isControlDisabled,
        multiselect,
        layout,
        options: rawOptions,
        onChange,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLDivElement>(null);
    const [selectedOptions, setSelectedOptions] = React.useState(props.selectedOptions);
    const valueChangedFromDefault = React.useRef(false);
    const defaultSelectedOptions = useDeepEqualMemo(props.selectedOptions);
    React.useEffect(()=>{
        
        if(arrayDifference(defaultSelectedOptions, selectedOptions)?.length !== 0){
            valueChangedFromDefault.current = false;
            setSelectedOptions(defaultSelectedOptions);
            inputRef.current 
            && onChange?.(
                {type: "change", target: inputRef.current}, 
                defaultSelectedOptions || []
            );
        }
    }, [defaultSelectedOptions]);

    const onSelectionChange = ( ev: React.FormEvent<HTMLDivElement>, selectedValue: string ) => {
        if(isRead || isControlDisabled){
            ev.preventDefault();
        } else {
            const event = { type: ev.type, target: {...ev.currentTarget}};
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
            valueChangedFromDefault.current = true;
            setSelectedOptions(newSelectedOptions);
            onChange?.(event, newSelectedOptions);
        }
    };
    
    const options = useDeepEqualMemo(rawOptions);
    const styles = useStyles();
    
    return <F9Field
        {...fieldProps}
        valueChanged={valueChangedFromDefault.current}
    >
        {
            multiselect
            ? 
                (controlProps: any) => (
                    <div 
                        {...controlProps} 
                        className={mergeClasses(styles.root, layout === "vertical" && styles.vertical )}>
                        {
                            options?.map((option) =>{
                                return <Checkbox 
                                required={false} 
                                key={option.value}
                                value={option.value}
                                label={option.text ?? option.value}
                                size={fieldProps.size == "large" ? "large" : "medium"}
                                checked={selectedOptions?.includes(option.value)}
                                onChange={(ev)=>{onSelectionChange(ev, option.value)}}
                                disabled={isControlDisabled}
                                {...option.props} />
                            })
                        }
                    </div>
                )
            : 
                <RadioGroup
                    {...restProps}
                    value={selectedOptions?.[0]}
                    onChange={(ev, data)=>{ onSelectionChange(ev, data.value)}}
                    disabled={isControlDisabled}
                    ref={inputRef}
                    layout={layout}
                >
                    {   
                        options?.map((option) => {
                            return <Radio 
                                key={option.value}
                                value={option.value} 
                                label={option.text ?? option.value}
                                className={mergeClasses()}
                                {...option.props}
                                />
                        })
                    }
                </RadioGroup>
        }
    </F9Field>
}