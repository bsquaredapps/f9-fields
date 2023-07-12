import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9ChoiceGroupField, 
    F9ChoiceGroupFieldOnChangeEventHandler, 
    F9ChoiceGroupFieldProps
} from "./F9ChoiceGroupField";
import { 
    F9Option,
    getSelectedOptionsFromRecords,
    getOptionsFromDataSet,
    getSelectedRecordsFromOptions,
    getValueColumn
} from "../components/options";
import { PAEvent, PASourceEvent, getPAEvent, PAEventsSchema } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { CheckboxProps, RadioProps } from "@fluentui/react-components";
import { F9FieldOnValidateEventHandler, F9FieldProps } from "../Field/F9Field";
import { ValidationSchema } from "../utils/ValidationSchema";
import PropertyListener, { PropertyType } from "../utils/PropertyListenter";

export class ChoiceGroupField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private controlName: string;
    private controlId: string;
    private controlUniqueId: string;
    private defaultSelectedItemsListener: PropertyListener;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private events: PAEvent[] = [];
    private options: F9Option<CheckboxProps & RadioProps>[];
    private optionsDataSet?: ComponentFramework.PropertyTypes.DataSet;
    private optionsValueColumn?: string;
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private pendingValidation: F9FieldProps["pendingValidation"];
    private validation: {
        Message: string;
        State: string;  
    };
    private dispatchOnChange: boolean = false;
    private dispatchOnSelect: boolean = false;
    private dispatchOnResize: boolean = false;
    private dispatchOnValidate: boolean = false;

    private onDefaultSelectedItemsChanged = (bindingContext: any)=>{
        const { ruleValue } = bindingContext.inputRow[this.controlName].DefaultSelectedItems;
        if(!ruleValue || ruleValue.length === 0){
            this.optionsDataSet?.setSelectedRecordIds([]);
        } else {
            this.optionsDataSet?.refresh();
        }
    }

    private onChange: F9ChoiceGroupFieldOnChangeEventHandler = (ev, newSelectedOptions) => {
        if(newSelectedOptions && ev){
            //this.events.push(getPAEvent(ev as PASourceEvent));
            const selectedRecordIds = getSelectedRecordsFromOptions(this.optionsDataSet, newSelectedOptions, this.options, this.optionsValueColumn);
            this.optionsDataSet?.setSelectedRecordIds(selectedRecordIds);
            this.dispatchOnChange = true;
            this.notifyOutputChanged();
        }
    }

    private onSelect: React.MouseEventHandler<any> = (ev): void => {
        this.events.push(getPAEvent(ev as PASourceEvent));
        this.dispatchOnSelect = true;
        this.notifyOutputChanged();
    }

    private onResize = (size?: ScrollSize, target?: React.MutableRefObject<null>): void =>{
        /*const resizeEvent: PASourceEvent = {
            type: "resize",
            target: target as PASourceTarget
        };
        this.events.push(getPAEvent(resizeEvent));*/
        this.contentHeight = size?.height;
        this.contentWidth = size?.width;
        this.dispatchOnResize = true;
        this.notifyOutputChanged();
    }
    
    private onValidate: F9FieldOnValidateEventHandler = (ev, validationData) => {
        const event = getPAEvent(
            {
                ...ev, 
                value: JSON.stringify(validationData)
            } as PASourceEvent
        );
        this.events.push(event);
        this.validation = {
            Message: validationData.validationMessage ?? "",
            State: validationData.validationState ?? (validationData.validationMessage ? "error" : "none")
        };
        this.dispatchOnValidate = true;
        this.notifyOutputChanged();
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
        this.pendingValidation = { 
            validationMessage: context.parameters.ValidationMessage.raw || undefined,
            validationState: context.parameters.ValidationState.raw || "none"
        };
        this.validation = {
            Message: "",
            State: "none"
        };
        context.mode.trackContainerResize(true);
        this.controlName = context.mode.label;
        this.controlId = (window as any).AppMagic?.AuthoringTool?.Runtime?.getNamedControl?.(this.controlName).OpenAjax.uniqueId;
        this.controlUniqueId = (context as any).client._customControlProperties.controlId;

        this.defaultSelectedItemsListener = new PropertyListener(this.controlId, this.controlUniqueId, this.controlName, "DefaultSelectedItems", PropertyType.Input);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        
        //dispatch events
        if(this.dispatchOnChange){
            (context as any).events.OnChange?.();
            this.dispatchOnChange = false;
        }
        if(this.dispatchOnSelect){
            (context as any).events.OnSelect?.();
            this.dispatchOnSelect = false;
        }
        if(this.dispatchOnResize){
            (context as any).events.OnResize?.();
            this.dispatchOnResize = false;
        }
        if(this.dispatchOnValidate){
            (context as any).events.OnValidate?.();
            this.dispatchOnValidate = false;
        }
        //clear events
        this.events.length = 0;
        
        //DefaultSelectedItems doesn't trigger a refresh when set to a collection, and doesn't reset when set to an empty array.
        //Property Listener fixes both of these.
        this.defaultSelectedItemsListener.listen(this.onDefaultSelectedItemsChanged);

        //convert options and default selected options
        this.optionsDataSet = context.parameters.Items;
        this.optionsValueColumn = getValueColumn(this.optionsDataSet.columns);
        this.options = getOptionsFromDataSet(this.optionsDataSet);

        //initialize values if not already
        if(!this.contentHeight || !this.contentWidth ){
            if(!this.contentHeight) this.contentHeight = context.mode.allocatedHeight;
            if(!this.contentWidth) this.contentWidth = context.mode.allocatedWidth;
            this.notifyOutputChanged();
        }

        //grab raw props
        this.label = context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        
        //update validation
        if(
            context.updatedProperties.includes("ValidationMessage") 
            || context.updatedProperties.includes("ValidationState")
        ){
           const pendingValidation = { 
                validationMessage: context.parameters.ValidationMessage.raw ?? '',
                validationState: 
                    context.parameters.ValidationState.raw 
                    ?? (context.parameters.ValidationMessage.raw ? "error" : "none"),
            };
            if(
                this.pendingValidation.validationMessage != pendingValidation.validationMessage
                || this.pendingValidation.validationState != pendingValidation.validationState
            ){
                this.pendingValidation = pendingValidation;
            }
        }
        
        const props: F9ChoiceGroupFieldProps = { 
            /* field props */
            fieldProps: {
                label: this.label,
                hint: this.hint,
                info: this.info,
                required: this.required,
                orientation: context.parameters.Orientation.raw,
                size: context.parameters.Size.raw || "medium",
                onResize: this.onResize,
                onClick: this.onSelect,
                onValidate: this.onValidate,
                validate: context.parameters.Validate.raw,
                pendingValidation: this.pendingValidation,
                style: {
                    height: context.mode.allocatedHeight,
                    width: context.mode.allocatedWidth
                }
            },
            /* control specific props */
            options: this.options,
            selectedOptions: getSelectedOptionsFromRecords(this.optionsDataSet, this.optionsValueColumn),
            multiselect: context.parameters.Multiselect.raw,
            layout: context.parameters.Layout.raw || "vertical",
            isRead: (context.mode as any).isRead,
            isControlDisabled: context.mode.isControlDisabled,
            onChange: this.onChange
        };
        return React.createElement(
            F9ChoiceGroupField, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Validation: {...this.validation},
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Events: [...this.events],
            Label: this.label,
            Hint: this.hint,
            Info: this.info,
            Required: this.required
        };
    }

    /**
     * It is called by the framework prior to a control init to get the output object(s) schema
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns an object schema based on nomenclature defined in manifest
     */
    public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> {
        return Promise.resolve({
            Events: PAEventsSchema,
            Validation: ValidationSchema
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
