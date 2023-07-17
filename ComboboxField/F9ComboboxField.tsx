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
    OptionProps,
    InputOnChangeData,
    Text,
    makeStyles
} from '@fluentui/react-components';
import { useDeepEqualMemo } from '../utils/useDeepEqualMemo';
import { arrayDifference } from '../utils/arrayDifference';

export type F9InputFieldOnChangeEventHandler = (ev?: { type?: string; target?: HTMLInputElement }, data?: InputOnChangeData) => void;

export type F9ComboboxFieldOnChangeEventHandler = (
    ev: { type?: string; target?: HTMLInputElement },
    data: OptionOnSelectData
) => void;

export interface F9ComboboxFieldProps extends Omit<ComboboxProps, "contentBefore" | "contentAfter" | "onClick" | "onChange" | "value" | "size"> {
    fieldProps: Omit<F9FieldProps, "valueChanged">;
    isRead?: boolean;
    isControlDisabled?: boolean;
    searchTextUpdated: boolean;
    allowSearch?: boolean;
    searchText?: string;
    options?: F9Option<OptionProps>[];
    defaultSelectedOptions?: string[];
    onChange: F9ComboboxFieldOnChangeEventHandler;
    onSearch: F9InputFieldOnChangeEventHandler;
}

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }

const renderOption = (option: F9Option<OptionProps>) => {
    return option.persona
        ? <Option {...option.props} key={option.value} value={option.value} text={option.text ?? option.value}>
            <Persona {...option.persona} />
        </Option>
        : <Option {...option.props} key={option.value} value={option.value}>
            {option.text ?? option.value}
        </Option>
};

const useStyles = makeStyles({
    root: {
        minWidth: "inherit"
    }
});

export const F9ComboboxField: React.FunctionComponent<F9ComboboxFieldProps> = (props) => {

    const {
        fieldProps,
        isRead,
        isControlDisabled,
        allowSearch,
        placeholder,
        options: rawOptions,
        searchTextUpdated,
        onBlur,
        onChange,
        onSearch,
        ...restProps
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);

    const [searchText, setSearchText] = React.useState(props.searchText);

    React.useEffect(() => {
        if (searchTextUpdated && props.searchText !== searchText) {
            setSearchText(props.searchText);
            inputRef.current &&
                onSearch?.(
                    { type: "change", target: inputRef.current },
                    { value: props.searchText || '' }
                );
        }
    }, [props.searchText, searchTextUpdated, setSearchText]);

    const defaultSelectedOptions = useDeepEqualMemo(props.selectedOptions);
    const [selectedOptions, setSelectedOptions] = React.useState(defaultSelectedOptions);
    const valueChangedFromDefault = React.useRef(false);

    React.useEffect(() => {
        if (arrayDifference(defaultSelectedOptions, selectedOptions)?.length !== 0) {
            valueChangedFromDefault.current = false;
            setSelectedOptions(defaultSelectedOptions);
            inputRef.current
                && onChange?.(
                    { type: "change", target: inputRef.current },
                    { optionValue: '', selectedOptions: defaultSelectedOptions || [] }
                );
        }
    }, [defaultSelectedOptions]);

    const onOptionSelect: ComboboxProps["onOptionSelect"] = (ev, data) => {
        const event = {
            type: ev.type,
            target: { ...ev.target } as HTMLInputElement
        };
        const { optionValue } = data;

        if (optionValue) {
            valueChangedFromDefault.current = true;
            setSelectedOptions(data.selectedOptions);
            onChange?.(event, data);
        }
    };

    const [isOpen, setIsOpen] = React.useState(false);
    const onOpenChange = (e: React.SyntheticEvent, data: ComboboxOpenChangeData) => {
        setIsOpen(data.open);
        if (!data.open) setSearchText('');
    }
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (allowSearch /*&& isOpen*/) {
            const value = e.target.value || '';
            setSearchText(value);
            const event = { ...e };
            valueChangedFromDefault.current = value != props.searchText;
            onSearch?.(event, { value })
        }
    }

    const options = useDeepEqualMemo(rawOptions);
    const groupedOptions = React.useMemo(() => {
        const groups: { [key: string]: F9Option<OptionProps>[] } = {};
        const filteredOptions =
            allowSearch && isOpen && searchText && searchText != ""
                ? options?.filter(
                    (option) => (option.text ?? option.value).toLowerCase().indexOf(searchText?.trim().toLowerCase()) !== -1
                )
                : options;

        filteredOptions?.forEach((pcfOption) => {
            const groupKey = pcfOption.group ?? '';
            const group = groups[groupKey] || [];
            group.push(pcfOption);
            groups[groupKey] = group;
        });
        return groups;
    }, [options, allowSearch, isOpen, searchText]);

    const styles = useStyles();

    return <F9Field
        {...fieldProps}
        valueChanged={valueChangedFromDefault.current}
    >
        {
            isRead

                ? <Text>
                    {
                        options?.filter((option) => selectedOptions?.includes(option.value))
                            .map((option) => option.text ?? option.value)
                            .join("; ")
                    }
                </Text>
                : <Combobox
                    {...restProps}
                    className={styles.root}
                    value={
                        allowSearch && isOpen
                            ? searchText
                            : options?.filter(option => selectedOptions?.includes(option.value))
                                .map(option => option.text ?? option.value)
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
                        Object.keys(groupedOptions).map((groupKey) => {
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