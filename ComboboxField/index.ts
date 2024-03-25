import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9ComboboxField, 
    F9ComboboxFieldProps,
    OptionOnSelectData
} from "./F9ComboboxField";
import {
    F9SimpleOption,
    parseOptions,
    mergeSelectedOptions
} from '../components/options/simpleOption';
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { InputOnChangeData, OptionProps } from "@fluentui/react-components";
import { arrayDifference } from "../utils/arrayDifference";

interface CustomContext<T> extends ComponentFramework.Context<T>{
    events: { [key: string]: () => void};
    mode: ComponentFramework.Context<T>["mode"] & { isRead: boolean }
    parameters: ComponentFramework.Context<T>["parameters"] & { DefaultSelectedItems?: {raw: any[] | {[key: string]: any}}}
}

export class ComboboxField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private eventQueue: PAEventQueue;
    private searchText?: string;
    private options: F9SimpleOption<OptionProps>[];
    private selectedOptions: F9SimpleOption<OptionProps>[];
    private selectedValues: string[];
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: string;
    private validationState: IInputs["ValidationState"]["raw"];
    private debounceTimeoutId?: number;
    private debounceTimeout: number = 300;
    private debounce: IInputs["DelayOutput"]["raw"];
    
    private maybeDebounceNotifyOutputChanged(){
        window.clearTimeout(this.debounceTimeoutId);
        switch(this.debounce){
            case "debounce":
                this.debounceTimeoutId = window.setTimeout(
                    this.notifyOutputChanged, 
                    this.debounceTimeout
                );
                break;
            case "onblur":
                break;
            default:
                this.notifyOutputChanged();
        }
    }
    
    private onBlur(ev: React.FocusEvent<HTMLInputElement>){
        if(this.debounce === "onblur"){
            window.clearTimeout(this.debounceTimeoutId);
            this.notifyOutputChanged();
        }
    }

    private onChange(targetRef: React.RefObject<HTMLInputElement>, data: OptionOnSelectData) {
            this.selectedValues = data.selectedOptions;
            this.selectedOptions = this.options.filter((option) => this.selectedValues.includes(option.Value));
            const event = {
                type: "change",
                target: targetRef,
                value: this.selectedValues.join(","),
            };
            this.eventQueue.add(event, "OnValueChange");
            this.maybeDebounceNotifyOutputChanged();
    }

    private onSearch(targetRef: React.RefObject<HTMLInputElement>, data?: InputOnChangeData){
        this.searchText = data?.value;
        const event = {
            type: "change",
            target: targetRef,
            value: this.searchText
        };
        this.eventQueue.add(event, "OnSearch");
        this.maybeDebounceNotifyOutputChanged();
    }
    
    private onSelect: React.MouseEventHandler<any> = (event): void => {
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        this.maybeDebounceNotifyOutputChanged();
    }

    private onResize(size?: ScrollSize, target?: React.MutableRefObject<null>){
        this.contentHeight = size?.height;
        this.contentWidth = size?.width;
        const event: PASourceEvent = {
            type: "resize",
            target: target as PASourceTarget,
            value: JSON.stringify({
                height: this.contentHeight,
                width: this.contentWidth
            })
        };
        this.eventQueue.add(event, "OnResize");
        this.maybeDebounceNotifyOutputChanged();
    }
    
    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.validationMessage = context.parameters.ValidationMessage.raw || "";
        this.validationState = context.parameters.ValidationState.raw;
        
        this.selectedOptions = parseOptions(context.parameters.SelectedOptions.raw);
        this.options = mergeSelectedOptions(
            parseOptions(context.parameters.Options.raw),
            this.selectedOptions
        );
        this.selectedValues = this.selectedOptions.map((option) => option.Value);
        this.searchText = context.parameters.SearchText.raw ?? "";
        this.contentHeight = context.mode.allocatedHeight;
        this.contentWidth = context.mode.allocatedWidth;
        this.eventQueue = new PAEventQueue();
        this.onBlur = this.onBlur.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.maybeDebounceNotifyOutputChanged = this.maybeDebounceNotifyOutputChanged.bind(this);
        context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: CustomContext<IInputs>): React.ReactElement {
        //execute queued events
        this.eventQueue.execute(context);
        const { 
            mode, 
            parameters,
            updatedProperties
        } =  context;

        const { 
            Options,
            SelectedOptions,
            Label, 
            Hint, 
            Info, 
            Required, 
            AllowSearch,
            Appearance,
            Placeholder,
            Orientation, 
            ValidationMessage, 
            ValidationState,
            Size,
            Multiselect,
            DelayOutput,
            DelayTimeout,
            SearchText,
        } = parameters;
        
        const { 
            isControlDisabled, 
            isRead, 
            isVisible, 
            allocatedHeight, 
            allocatedWidth 
        } = mode;

        
        let mergeOptions = false;
        if(updatedProperties.includes('Options')){
            const newOptions: F9SimpleOption<OptionProps>[] = parseOptions(Options.raw);
            if(arrayDifference(this.options, newOptions)?.length ?? 0 > 0){
                this.options = newOptions;
                mergeOptions = true;
            }
        }
        
        if(updatedProperties.includes('SelectedOptions')){
            const newSelectedOptions: F9SimpleOption<OptionProps>[] = parseOptions(SelectedOptions.raw); 
            const newSelectedValues: string[] = newSelectedOptions.map((value) => value.Value);
            if(arrayDifference(this.selectedValues, newSelectedValues)?.length ?? 0 > 0){
                this.selectedValues = newSelectedValues;
                this.selectedOptions = newSelectedOptions;
                mergeOptions = true;
            }
        }

        if(mergeOptions){
            this.options = mergeSelectedOptions(this.options, this.selectedOptions);
        }

        //grab raw props
        this.debounceTimeout = DelayTimeout.raw || 300;
        this.debounce = DelayOutput.raw;
        this.label = Label.raw || '';
        this.hint = Hint.raw || '';
        this.info = Info.raw || '';
        this.required = Required.raw;
        this.validationMessage = ValidationMessage.raw || '';
        this.validationState = ValidationState.raw || "none";

        //handle input value change from powerapps//handle input value change from powerapps
        const searchTextUpdated = updatedProperties.includes("SearchText");
        if(searchTextUpdated) {
            this.searchText = SearchText.raw ?? "";
        }        
        const props: F9ComboboxFieldProps = { 
            /* field props */
            fieldProps: {
                label: this.label,
                hint: this.hint,
                info: this.info,
                required: this.required,
                orientation: Orientation.raw,
                size: Size.raw || "medium",
                onResize: this.onResize,
                onClick: this.onSelect,
                validationMessage: this.validationMessage,
                validationState: this.validationState,
                style: {
                    height: allocatedHeight,
                    width: allocatedWidth
                }
            },
            /* control specific props */
            searchText: this.searchText,
            searchTextUpdated: searchTextUpdated,
            placeholder: Placeholder.raw || undefined,
            options: this.options,
            selectedOptions: this.selectedValues,
            multiselect: Multiselect.raw,
            allowSearch: AllowSearch.raw,
            appearance: Appearance.raw || "outline",
            isRead: isRead,
            isControlDisabled: isControlDisabled,
            onBlur: this.onBlur,
            onChange: this.onChange,
            onSearch: this.onSearch
        };
        return React.createElement(
            F9ComboboxField, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Events: this.eventQueue.getOutput(),
            SearchText: this.searchText,
            Label: this.label,
            Hint: this.hint,
            Info: this.info,
            Required: this.required,
            ValidationMessage: this.validationMessage,
            ValidationState: this.validationState,
            SelectedOptions: JSON.stringify(this.selectedOptions)
        };
    }

    /**
     * It is called by the framework prior to a control init to get the output object(s) schema
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns an object schema based on nomenclature defined in manifest
     */
    public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> {
        return Promise.resolve({
            Events: PAEventsSchema
        });
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
