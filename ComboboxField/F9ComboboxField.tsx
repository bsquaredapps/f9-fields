import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field';
import { F9Option } from '../components/options/option';
import { 
    Combobox,
    ComboboxOpenChangeData,
    ComboboxProps,
    Option,
    OptionGroup,
    Persona,
    OptionProps
} from '@fluentui/react-components/unstable';
import { 
    InputOnChangeData,
    Text
} from '@fluentui/react-components';
import { useDefaultState } from '../utils/useDefaultState';
import { useDeepEqualMemo } from '../utils/useDeepEqualMemo';

export type F9InputFieldOnChangeEventHandler = (ev?: {type?: string; target?: HTMLInputElement}, data?: InputOnChangeData) => void;

export type F9ComboboxFieldOnChangeEventHandler = (
    ev: React.ChangeEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>, 
    data: OptionOnSelectData
) => void;

export interface F9ComboboxFieldProps extends Omit<ComboboxProps, "contentBefore" | "contentAfter" | "onClick" | "onChange" | "value" | "size"> {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    allowSearch?: boolean;
    defaultSearchText?: string;
    delayOutput?: "none" | "debounce" | "onblur";
    delayTimeout?: number;
    options?: F9Option<OptionProps>[];
    defaultSelectedOptions?: string[];
    onSearch: F9InputFieldOnChangeEventHandler;
    onChange: F9ComboboxFieldOnChangeEventHandler;
}

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }

const renderOption = (option: F9Option<OptionProps>) =>{
        return option.persona
        ? <Option {...option.props} key={option.value} value={option.value} text={option.text ?? option.value}>
            <Persona {...option.persona} />
          </Option>
        : <Option {...option.props} key={option.value} value={option.value}>
            {option.text ?? option.value}
          </Option>
};

export const F9ComboboxField: React.FunctionComponent<F9ComboboxFieldProps> = (props)=>{

    const {
        fieldProps,
        isRead,
        isControlDisabled,
        allowSearch,
        defaultSearchText,
        placeholder,
        delayOutput,
        delayTimeout,
        options: rawOptions,
        selectedOptions,
        onChange,
        onSearch,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    /*const onDefaultValueChanged = React.useCallback((newValue?: string[])=>{
        inputRef.current && onChange?.(
            {type: "change", target: {...inputRef.current}} as any as React.ChangeEvent<HTMLElement>, 
            {optionValue: "", selectedOptions: newValue || []}
        )

    },[inputRef, inputRef.current, onChange]);
    const [selectedOptions, setSelectedOptions] = useDefaultState({
        defaultState: defaultSelectedOptions,
        onDefaultChange: onDefaultValueChanged
    });*/

    
    const onOptionSelect: F9ComboboxFieldOnChangeEventHandler = ( ev, data ) => {
        const event = {...ev};
        const { optionValue } = data;

        if(optionValue){            
            const newSelectionOptions = 
                props.multiselect 
                ?
                    selectedOptions?.includes(optionValue) 
                    ? selectedOptions.filter(selectedOption => selectedOption != optionValue)
                    : [...(selectedOptions || []), optionValue]
                :
                    selectedOptions?.includes(optionValue)
                    ? []
                    : [optionValue]
            console.log(data);
            //setSelectedOptions(newSelectionOptions);
            onChange?.(event, data);
        }
    };

    const [searchText, setSearchText] = useDefaultState({
        defaultState: defaultSearchText
    });

    const [isOpen, setIsOpen] = React.useState(false);
    const onOpenChange = (e: React.SyntheticEvent, data: ComboboxOpenChangeData)=>{
        setIsOpen(data.open);
        if(!data.open) setSearchText('');
    }
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e)=>{
        console.log({e, from:"inputChange", allowSearch, isOpen, target: {...e.target}});
        if(allowSearch && isOpen){
            const value = e.target.value || '';
            setSearchText(value);
            onSearch?.(e, {value})
        } 
    },[allowSearch, isOpen])

    const options = useDeepEqualMemo(rawOptions);
    const groupedOptions = React.useMemo(()=>{
        const groups: {[key: string]: F9Option<OptionProps>[]} = {};
        const filteredOptions = 
            allowSearch && isOpen && searchText && searchText != ""
            ? options?.filter(
                (option)=>(option.text ?? option.value).toLowerCase().indexOf(searchText?.trim().toLowerCase()) !== -1
              )
            : options;

        filteredOptions?.forEach((pcfOption)=>{
            const groupKey = pcfOption.group ?? '';
            const group = groups[groupKey] || [];
            group.push(pcfOption);
            groups[groupKey] = group;
        });
        return groups;
    },[options, allowSearch, isOpen, searchText]);

    return <F9Field {...fieldProps}>
        {
            isRead

            ? <Text>
                {
                    options?.filter((option)=>selectedOptions?.includes(option.value))
                        .map((option)=>option.text ?? option.value)
                        .join("; ")
                }
              </Text>
            : <Combobox
                {...restProps}
                value={
                    allowSearch && isOpen 
                    ? searchText
                    : options?.filter(option=>selectedOptions?.includes(option.value))
                        .map(option=>option.text ?? option.value)
                        .join(', ')
                }
                selectedOptions={props.selectedOptions}
                placeholder={placeholder}
                freeform={allowSearch}
                onOptionSelect={onOptionSelect}
                onChange={onInputChange}
                onOpenChange={onOpenChange}
                disabled={isControlDisabled}
                size={fieldProps.size}
                ref={inputRef}
              >
                {   
                    Object.keys(groupedOptions).map((groupKey)=>{
                        const group = groupedOptions[groupKey];
                        return groupKey === "" 
                            ? group.map((option) => renderOption(option))
                            : <OptionGroup label={groupKey}>
                                {
                                    group.map((option) => renderOption(option))
                                }
                            </OptionGroup>
                    })
                }
              </Combobox>
        }
    </F9Field>
}