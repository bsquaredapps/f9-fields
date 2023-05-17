import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9ComboboxField, 
    F9InputFieldOnChangeEventHandler, 
    F9ComboboxFieldOnChangeEventHandler, 
    F9ComboboxFieldProps
} from "./F9ComboboxField";
import {
    F9Option,
    getOptionsFromDataSet,
    getSelectedOptionsFromRecords,
    getSelectedRecordsFromOptions,
    getValueColumn
} from '../components/options';
import { PAEvent, PASourceEvent, PASourceTarget, getPAEvent, PAEventSchema } from "../utils/PAEvent";
import { ElementSize } from '../utils/useElementSize';
import * as React from "react";
import { injectListener } from "../utils/DefaultItemsListener";
import { OptionProps } from "@fluentui/react-components/unstable";

export class ComboboxField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private event: PAEvent;
    private searchText?: string;
    private optionsDataSet?: ComponentFramework.PropertyTypes.DataSet;
    private optionsValueColumn?: string;
    private options: F9Option<OptionProps>[];
    private selectedOptions: F9Option<OptionProps>[];
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: IOutputs["ValidationMessage"];
    private validationState: IInputs["ValidationState"]["raw"];
    private notifyOnChange?: ()=>void;
    private notifyOnSelect?: ()=>void;
    private notifyOnResize?: ()=>void;
    private notifyOnSearch?: ()=>void;
    private defaultItemsListener: ()=>any;

    private onChange: F9ComboboxFieldOnChangeEventHandler = (ev, data) => {
        if(data?.optionValue && ev){
            this.event = getPAEvent(ev as PASourceEvent);
            const selectedRecordIds = getSelectedRecordsFromOptions(this.optionsDataSet,data.selectedOptions, this.options, this.optionsValueColumn);
            this.optionsDataSet?.setSelectedRecordIds(selectedRecordIds);
            this.notifyOutputChanged();
            this.notifyOnChange?.();
        }
    }

    private onSearch: F9InputFieldOnChangeEventHandler = (ev, data) => {
        this.event = getPAEvent(ev as PASourceEvent);
        this.searchText = data?.value;
        this.notifyOutputChanged();
        this.notifyOnSearch?.();
    }
    
    private onSelect: React.MouseEventHandler<any> = (ev): void => {
        this.event = getPAEvent(ev as PASourceEvent);
        this.notifyOutputChanged();
        this.notifyOnSelect?.();
    }

    private onResize = (size?: ElementSize, target?: React.MutableRefObject<null>): void =>{
        const resizeEvent: PASourceEvent = {
            type: "resize",
            target: target as PASourceTarget
        };
        this.event = getPAEvent(resizeEvent);
        this.contentHeight = size?.height;
        this.contentWidth = size?.width;
        
        this.notifyOutputChanged();
        this.notifyOnResize?.();
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
        context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        (window as any).comboContext = context;
        //attach event notifiers
        this.notifyOnChange = (context as any).events.OnChange;
        this.notifyOnSelect = (context as any).events.OnSelect;
        this.notifyOnResize = (context as any).events.OnResize;
        this.notifyOnResize = (context as any).events.OnSearch;
        this.optionsDataSet = context.parameters.Items;
        if(!this.defaultItemsListener && (context.parameters as any).DefaultSelectedItems?.raw){
            injectListener(
                (context.parameters as any).DefaultSelectedItems.raw,
                context.mode.label,
                ()=>{this.optionsDataSet?.refresh()}
            );
        }

        //convert options and default selected options
        this.optionsValueColumn = getValueColumn(this.optionsDataSet.columns);
        this.options = getOptionsFromDataSet(this.optionsDataSet);
        
        //initialize values if not already
        if(!this.contentHeight || !this.contentWidth || (!this.searchText && !(this.searchText == ""))){
            if(!this.contentHeight) this.contentHeight = context.mode.allocatedHeight;
            if(!this.contentWidth) this.contentWidth = context.mode.allocatedWidth;
            if(!this.searchText) this.searchText = context.parameters.DefaultSearchText.raw ?? '';
            this.notifyOutputChanged();
        }

        this.label = context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        this.validationMessage = context.parameters.ValidationMessage.raw || undefined;
        this.validationState = context.parameters.ValidationState.raw || "error";
        
        const props: F9ComboboxFieldProps = { 
            /* field props */
            fieldProps: {
                label: this.label,
                hint: this.hint,
                info: this.info,
                required: this.required,
                validationMessage: this.validationMessage,
                validationState: this.validationState,
                orientation: context.parameters.Orientation.raw,
                size: context.parameters.Size.raw || "medium",
                onResize: this.onResize,
                onClick: this.onSelect
            },
            /* control specific props */
            defaultSearchText: context.parameters.DefaultSearchText.raw || "",
            placeholder: context.parameters.Placeholder.raw || undefined,
            options: this.options,
            selectedOptions: getSelectedOptionsFromRecords(this.optionsDataSet, this.optionsValueColumn),
            multiselect: context.parameters.Multiselect.raw,
            allowSearch: context.parameters.AllowSearch.raw,
            appearance: context.parameters.Appearance.raw || "outline",
            delayOutput: context.parameters.DelayOutput.raw || "none",
            delayTimeout: context.parameters.DelayTimeout.raw || 300,
            isRead: (context.mode as any).isRead,
            isControlDisabled: context.mode.isControlDisabled,
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
        const _selectedOptions = 
            this.selectedOptions
                .map(option => ({
                    Value: option.value, 
                    Text: option.text, 
                    Group: option.group
                }));
        return { 
            SearchText: this.searchText,
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Event: this.event,
            Label: this.label,
            Hint: this.hint,
            Info: this.info,
            ValidationMessage: this.validationMessage,
            ValidationState: this.validationState
        };
    }

    /**
     * It is called by the framework prior to a control init to get the output object(s) schema
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns an object schema based on nomenclature defined in manifest
     */
    public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> {
        return Promise.resolve({
            Event: PAEventSchema
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
