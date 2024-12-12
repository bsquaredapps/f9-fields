import * as React from 'react';
import { F9Field, F9FieldProps } from '../../Field/Field/F9Field';
import { F9SimpleOption } from '../../Utilities/simpleOption';
import {
    Combobox,
    ComboboxProps,
    Option,
    OptionGroup,
    Persona,
    OptionProps,
    InputOnChangeData,
    Text,
    makeStyles,
    useId,
    shorthands,
    tokens,
    Button,
    mergeClasses
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';

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
    showTags?: boolean;
    allowCustomOptions?: boolean;
    addCustomOptionLabel?: string;
    controlHeight?: number | "auto";
    controlWidth?: number | "auto";
    onChange: F9ComboboxFieldOnChangeEventHandler;
    onSearch: F9InputFieldOnChangeEventHandler;
}

export type OptionOnSelectData = { optionValue: string | undefined; selectedOptions: string[] }



const useStyles = makeStyles({
    root: {
        // Stack the label above the field with a gap
        minWidth: "inherit",
    },
    tagsList: {
        listStyleType: "none",
        marginBottom: tokens.spacingVerticalXXS,
        marginTop: 0,
        paddingLeft: 0,
        display: "flex",
        flexWrap: "wrap",
        gridGap: tokens.spacingHorizontalXXS,
    },
    fieldRoot: {
        justifyItems: "stretch",
        justifyContent: "stretch"
    },
    wrapper: {
        display: "grid"
    },
    input: {
        minWidth: "0px"
    }
});

interface TagsListProps {
    controlId: string;
    selectedOptions: F9SimpleOption<OptionProps>[];
}


export const F9ComboboxField: React.FunctionComponent<F9ComboboxFieldProps> = (props) => {

    const {
        fieldProps,
        isRead,
        isControlDisabled,
        allowSearch,
        placeholder,
        searchTextUpdated,
        allowCustomOptions,
        addCustomOptionLabel,
        showTags,
        onBlur,
        onChange,
        onSearch,
        controlHeight,
        controlWidth,
        style,
        className,
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

    const [options, setOptions] = React.useState<F9SimpleOption<OptionProps>[]>(props.options ?? []);
    React.useEffect(()=>{
        setOptions(props.options ?? []);
    },[props.options]);

    const onOptionSelect: ComboboxProps["onOptionSelect"] = React.useCallback((ev, data) => {
        const { optionValue } = data;

        if (optionValue) {
            setSelectedOptions(data.selectedOptions);
            setSearchText("");
            onChange?.(inputRef, data);
        }
    },[setSelectedOptions, setSearchText, onChange, inputRef]);

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (allowSearch) {
            const value = e.target.value || '';
            setSearchText(value);
            onSearch?.(inputRef, { value })
        }
    }

    const groupedOptions = React.useMemo(() => {
        const groups: { [key: string]: F9SimpleOption<OptionProps>[] } = {};
        
        let filteredOptions: F9SimpleOption<OptionProps>[];

        if(allowSearch && searchText && searchText != ""){
            let showCustomOption = allowCustomOptions ?? false;
            filteredOptions = (options ?? []).filter(
                (option) => {
                    const text = option.Text ?? option.Value;
                    if(text.toLowerCase().trim() === searchText?.toLowerCase().trim()){
                        showCustomOption = false;
                    }
                    return text.toLowerCase().indexOf(searchText?.trim().toLowerCase()) !== -1
                }
            );
            if(showCustomOption){
                filteredOptions.push({ Value: searchText, Text: searchText, IsCustom: true})
            }
        } else {
            filteredOptions = options ?? [];
        }

        filteredOptions?.forEach((pcfOption) => {
            const groupKey = pcfOption.Group ?? '';
            const group = groups[groupKey] || [];
            group.push(pcfOption);
            groups[groupKey] = group;
        });

        return groups;
    }, [options, allowSearch, searchText, allowCustomOptions]);

    const renderOption = React.useCallback((option: F9SimpleOption<OptionProps>) => {
        const personaProps = option.Persona;
        const value = option.Value;
        const text = option.Text ?? value;
        return personaProps
            ? <Option {...option.Props} key={value} value={value} text={text}>
                <Persona {...option.Persona} />
            </Option>
            : <Option {...option.Props} key={value} value={value}>
                {(option.IsCustom ? addCustomOptionLabel + " " : "") + text}
            </Option>
    }, [addCustomOptionLabel]);

    // refs for managing focus when removing tags
    const selectedListRef = React.useRef<HTMLUListElement>(null);
    
    const styles = useStyles();
    const tagsList = React.useCallback((comboId: string, selectedListId: string, isRead: boolean) => {

        const onTagClick = (option: string, index: number) => {
            if(isRead)
                return;
            // remove selected option
            setSelectedOptions(selectedOptions.filter((o) => o !== option));
    
            // focus previous or next option, defaulting to focusing back to the combo input
            const indexToFocus = index === 0 ? 1 : index - 1;
            const optionToFocus = selectedListRef.current?.querySelector(
                `#${comboId}-remove-${indexToFocus}`
            );
            if (optionToFocus) {
                (optionToFocus as HTMLButtonElement).focus();
            } else {
                inputRef.current?.focus();
            }
        };


        return showTags && selectedOptions.length ? 
            <ul
                id={selectedListId}
                className={styles.tagsList}
                ref={selectedListRef}
                >
                {/* The "Remove" span is used for naming the buttons without affecting the Combobox name */}
                <span id={`${comboId}-remove`} hidden>
                    Remove
                </span>
                {
                    selectedOptions.map((selectedOption, i) => {
                        const option = options.find((option) => option.Value == selectedOption );
                        const text = 
                            option === undefined || option === null ? selectedOption :
                            option.IsCustom ? option.Value :
                            option.Text ?? option.Value ?? selectedOption;

                        return (
                            <li key={selectedOption}>
                                <Button
                                    size="small"
                                    shape="circular"
                                    appearance="primary"
                                    icon={!isRead ? <Dismiss12Regular /> : null}
                                    iconPosition="after"
                                    onClick={() => onTagClick(selectedOption, i)}
                                    id={`${comboId}-remove-${i}`}
                                    aria-labelledby={`${comboId}-remove ${comboId}-remove-${i}`}
                                >
                                    {text}
                                </Button>
                            </li>
                        )
                    })
                }
            </ul> : 
            null
    }, [options, selectedOptions, setSelectedOptions, styles, inputRef, showTags]);
    
    const controlStyle = React.useMemo(()=>{
        const _style: React.CSSProperties = {};
        if(controlWidth && controlWidth !== "auto")
            _style.width = controlWidth;
        if(controlHeight && controlHeight !== "auto")
            _style.height = controlHeight;
        return _style
    },[controlWidth, controlHeight]);

    return <F9Field 
        {...fieldProps}
        className={mergeClasses(fieldProps.className, styles.fieldRoot)} 
    >{
        (fieldControlProps) => {
            const selectedListId = useId(`${fieldControlProps.id}-selection`);
            const ariaLabelledBy = 
                showTags && selectedOptions.length > 0
                ? `${fieldControlProps.id} ${selectedListId}` 
                : fieldControlProps.id;

            return (
                <div
                    className={mergeClasses(
                        "fui-ComboboxWrapper",
                        className,
                        styles.wrapper
                    )}
                    style={{...style, ...controlStyle}}
                >
                    { tagsList(fieldControlProps.id ?? '', selectedListId, isRead ?? false) }
                    { 
                        isRead && !showTags &&
                            <Text {...fieldControlProps} style={controlStyle}>
                                {
                                    options?.filter((option) => selectedOptions?.includes(option.Value))
                                        .map((option) => option.Text ?? option.Value)
                                        .join("; ")
                                }
                            </Text>
                    }
                    {
                        !isRead &&
                            <Combobox
                                {...restProps}
                                {...fieldControlProps}
                                aria-labelledby={ariaLabelledBy}
                                className={styles.root}
                                value={
                                    allowSearch
                                        ? searchText
                                        : options?.filter(option => selectedOptions?.includes(option.Value))
                                            .map(option => option.Text ?? option.Value)
                                            .join(', ')
                                }
                                selectedOptions={selectedOptions}
                                placeholder={placeholder}
                                freeform={allowSearch}
                                input={{className: styles.input}}
                                onOptionSelect={onOptionSelect}
                                onChange={onInputChange}
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
                </div>
            )
        }
    }</F9Field>
}