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
import { useDefaultState } from '../utils/useDefaultState';
import { useDeepEqualMemo } from '../utils/useDeepEqualMemo';

export type F9InputFieldOnChangeEventHandler = (ev?: {type?: string; target?: HTMLInputElement}, data?: InputOnChangeData) => void;

export type F9ChoiceGroupFieldOnChangeEventHandler = (
    ev: React.ChangeEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>, 
    data: OptionOnSelectData
) => void;

export interface F9ChoiceGroupFieldProps extends Omit<RadioGroupProps, "onClick" | "onChange" | "value" > {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    multiselect?: boolean;
    options?: F9Option<CheckboxProps & RadioProps>[];
    defaultSelectedOptions?: string[];
    onChange?: (ev: React.FormEvent<HTMLDivElement>, selectedOptions: string[]) => void;
}

export type SelectionEvents =
  | React.ChangeEvent<HTMLElement>
  | React.KeyboardEvent<HTMLElement>
  | React.MouseEvent<HTMLElement>;

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
        defaultSelectedOptions,
        onChange,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const onDefaultValueChanged = React.useCallback((newValue?: string[])=>{
        inputRef.current && onChange?.(
            {type: "change", target: {...inputRef.current}} as any as React.ChangeEvent<HTMLDivElement>, 
            newValue || []
        )

    },[inputRef, inputRef.current, onChange]);
    
    const [selectedOptions, setSelectedOptions] = useDefaultState({
        defaultState: defaultSelectedOptions,
        onDefaultChange: onDefaultValueChanged
    });

    const onSelectionChange = ( ev: React.FormEvent<HTMLDivElement>, selectedValue: string ) => {
        if(isRead || isControlDisabled){
            setSelectedOptions([...(selectedOptions || [])]);
        } else {
            const event = {...ev};
            const newSelectedOptions = 
                multiselect 
                ?
                    selectedOptions?.includes(selectedValue) 
                    ? selectedOptions.filter(selectedOption => selectedOption != selectedValue)
                    : [...(selectedOptions || []), selectedValue]
                :
                    selectedOptions?.includes(selectedValue)
                    ? []
                    : [selectedValue]
            setSelectedOptions(newSelectedOptions);
            onChange?.(event, newSelectedOptions);
        }
    };

    const options = useDeepEqualMemo(rawOptions);
    const styles = useStyles();

    return <F9Field {...fieldProps}
    >
        {
            multiselect
            ? 
                (controlProps) => (
                    <div 
                        {...controlProps} 
                        className={mergeClasses(styles.root, layout === "vertical" && styles.vertical )}>
                        {
                            options?.map((option) =>{
                                return <Checkbox 
                                {...option.props} 
                                key={option.value}
                                value={option.value}
                                label={option.text ?? option.value}
                                size={fieldProps.size == "large" ? "large" : "medium"}
                                checked={selectedOptions?.includes(option.value)}
                                onChange={(ev)=>{onSelectionChange(ev, option.value)}}
                                disabled={isControlDisabled} />
                            })
                        }
                    </div>
                )
            : 
                <RadioGroup
                    {...restProps}
                    value={selectedOptions?.[0]}
                    onChange={(ev, data)=>{onSelectionChange(ev, data.value)}}
                    disabled={isControlDisabled}
                    ref={inputRef}
                    layout={layout}
                >
                    {   
                        options?.map((option) => {
                            return <Radio 
                                {...option.props}
                                key={option.value}
                                value={option.value} 
                                label={option.text ?? option.value}
                                />
                        })
                    }
                </RadioGroup>
        }
    </F9Field>
}