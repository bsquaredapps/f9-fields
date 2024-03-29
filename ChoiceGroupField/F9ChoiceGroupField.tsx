import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field';
import { F9SimpleOption } from '../components/options/simpleOption';
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
        options,
        onChange,
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
    
    return <F9Field
        {...fieldProps}
    >
        {
            multiselect
            ? 
                (controlProps: any) => (
                    <div 
                    ref={inputRef}
                        {...controlProps} 
                        className={mergeClasses(styles.root, layout === "vertical" && styles.vertical )}>
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
                                className={mergeClasses()}
                                {...option.Props}
                                />
                        })
                    }
                </RadioGroup>
        }
    </F9Field>
}