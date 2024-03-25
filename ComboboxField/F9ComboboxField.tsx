import * as React from 'react';
import { F9Field, F9FieldProps } from '../Field/F9Field';
import { F9SimpleOption } from '../components/options/simpleOption';
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

export type F9InputFieldOnChangeEventHandler = (targetRef: React.RefObject<HTMLInputElement>, data?: InputOnChangeData) => void;

export type F9ComboboxFieldOnChangeEventHandler = (
    targetRef: React.RefObject<HTMLInputElement>,
    data: OptionOnSelectData
) => void;

export interface F9ComboboxFieldProps extends Omit<ComboboxProps, "contentBefore" | "contentAfter" | "onClick" | "onChange" | "value" | "size"> {
    fieldProps: F9FieldProps;
    isRead?: boolean;
    isControlDisabled?: boolean;
    searchTextUpdated: boolean;
    allowSearch?: boolean;
    searchText?: string;
    options?: F9SimpleOption<OptionProps>[];
    defaultSelectedOptions?: string[];
    onChange: F9ComboboxFieldOnChangeEventHandler;
    onSearch: F9InputFieldOnChangeEventHandler;
}

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }

const renderOption = (option: F9SimpleOption<OptionProps>) => {
    const personaProps = option.Persona;
    const value = option.Value;
    const text = option.Text ?? value;
    return personaProps
        ? <Option {...option.Props} key={value} value={value} text={text}>
            <Persona {...option.Persona} />
        </Option>
        : <Option {...option.Props} key={value} value={value}>
            {text}
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
        options,
        searchTextUpdated,
        onBlur,
        onChange,
        onSearch,
        ...restProps
    } = props;
    
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(props.selectedOptions ?? [])
    React.useEffect(()=>{
        setSelectedOptions(props.selectedOptions ?? []);
    },[props.selectedOptions]);

    const [searchText, setSearchText] = React.useState(props.searchText);
    React.useEffect(() => {
        if (searchTextUpdated && props.searchText !== searchText) {
            setSearchText(props.searchText);
        }
    }, [props.searchText, searchTextUpdated, setSearchText]);

    const onOptionSelect: ComboboxProps["onOptionSelect"] = (ev, data) => {
        const { optionValue } = data;

        if (optionValue) {
            setSelectedOptions(data.selectedOptions);
            onChange?.(inputRef, data);
        }
    };

    const [isOpen, setIsOpen] = React.useState(false);
    const onOpenChange = (e: React.SyntheticEvent, data: ComboboxOpenChangeData) => {
        setIsOpen(data.open);
    }
    
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (allowSearch /*&& isOpen*/) {
            const value = e.target.value || '';
            setSearchText(value);
            onSearch?.(inputRef, { value })
        }
    }

    const groupedOptions = React.useMemo(() => {
        const groups: { [key: string]: F9SimpleOption<OptionProps>[] } = {};
        const filteredOptions =
            allowSearch && isOpen && searchText && searchText != ""
                ? options?.filter(
                    (option) => {
                        const text = option.Text ?? option.Value;
                        return text.toLowerCase().indexOf(searchText?.trim().toLowerCase()) !== -1
                    }
                )
                : options;

        filteredOptions?.forEach((pcfOption) => {
            const groupKey = pcfOption.Group ?? '';
            const group = groups[groupKey] || [];
            group.push(pcfOption);
            groups[groupKey] = group;
        });
        return groups;
    }, [options, allowSearch, isOpen, searchText]);

    const styles = useStyles();

    return <F9Field
        {...fieldProps}
    >
        {
            isRead

                ? <Text>
                    {
                        options?.filter((option) => selectedOptions?.includes(option.Value))
                            .map((option) => option.Text ?? option.Value)
                            .join("; ")
                    }
                </Text>
                : <Combobox
                    {...restProps}
                    className={styles.root}
                    value={
                        allowSearch && isOpen
                            ? searchText
                            : options?.filter(option => selectedOptions?.includes(option.Value))
                                .map(option => option.Text ?? option.Value)
                                .join(', ')
                    }
                    selectedOptions={selectedOptions}
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