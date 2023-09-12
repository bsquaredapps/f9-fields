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
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { CheckboxProps, RadioProps } from "@fluentui/react-components";
import { F9FieldOnValidateData, F9FieldOnValidateEventHandler, F9FieldProps } from "../Field/F9Field";
import { ValidationSchema } from "../utils/ValidationSchema";
import { arrayDifference } from "../utils/arrayDifference";

interface CustomContext<T> extends ComponentFramework.Context<T>{
    events: { [key: string]: () => void};
    mode: ComponentFramework.Context<T>["mode"] & { isRead: boolean }
}
export class ChoiceGroupField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private eventQueue: PAEventQueue;
    private fnEvents: {[key:string]: ()=>void};
    private options: F9Option<CheckboxProps & RadioProps>[];
    private optionsDataSet?: ComponentFramework.PropertyTypes.DataSet;
    private optionsValueColumn?: string;
    private selectedOptions: string[];
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private pendingValidation: F9FieldProps["pendingValidation"];
    private validation: {
        Message: string;
        State: string;  
    };
    private userUpdatedValue = false;
    private resetDefaultSelectedItems = false;

    private onChange(targetRef: React.RefObject<HTMLDivElement>, selectedOptions: string[]){

        if(this.optionsDataSet){
            
            this.userUpdatedValue = true;
            this.selectedOptions = selectedOptions;

            const selectedRecordIds = getSelectedRecordsFromOptions(
                this.optionsDataSet, 
                this.selectedOptions, 
                this.options, 
                this.optionsValueColumn
            );
            
            const event = {
                type: "change",
                target: targetRef,
                value: this.selectedOptions.join(","),
            };
            this.eventQueue.add(event, "");

            if(selectedRecordIds){
               this.optionsDataSet.setSelectedRecordIds(selectedRecordIds)
            } else {
                this.optionsDataSet.setSelectedRecordIds([])
            }
            
            this.fnEvents?.OnChange?.();
        }
    }
    private onSelect(event: React.MouseEvent<any>): void {
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        this.notifyOutputChanged();
    }

    private onResize(size?: ScrollSize, target?: React.MutableRefObject<null>): void {
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
        this.notifyOutputChanged();
    }
    
    private onValidate(targetRef: React.RefObject<HTMLElement>, validationData: F9FieldOnValidateData) {
        this.validation = {
            Message: validationData.validationMessage ?? "",
            State: validationData.validationState ?? (validationData.validationMessage ? "error" : "none")
        };
        const event = {
            type: "validate",
            target: targetRef,
            value: JSON.stringify(this.validation)
        };
        this.eventQueue.add(event, "OnValidate");
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
        this.contentHeight = context.mode.allocatedHeight ?? 0;
        this.contentWidth = context.mode.allocatedWidth ?? 0;
        this.eventQueue = new PAEventQueue();
        this.onChange = this.onChange.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onValidate = this.onValidate.bind(this);
        this.onSelect = this.onSelect.bind(this);
        
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
            events, 
            mode, 
            parameters,
            updatedProperties
        } =  context;

        const { 
            Items, 
            Label, 
            Hint, 
            Info, 
            Required, 
            Layout, 
            Orientation, 
            Validate,
            ValidationMessage, 
            ValidationState,
            Size,
            Multiselect
        } = parameters;
        
        const { isControlDisabled, isRead } = mode;

        this.fnEvents = events;
        this.optionsDataSet = Items;
        this.optionsValueColumn = getValueColumn(this.optionsDataSet.columns);
        this.options = getOptionsFromDataSet<CheckboxProps & RadioProps>(this.optionsDataSet);
        
        this.label = Label.raw || undefined;
        this.hint = Hint.raw || undefined;
        this.info = Info.raw || undefined;
        this.required = Required.raw ?? false;

        this.fnEvents = (context as any).events;
        

        if(this.resetDefaultSelectedItems){
            this.resetDefaultSelectedItems = false;
            context.parameters.Items.refresh();
        } else {
            const selectedOptions = getSelectedOptionsFromRecords(this.optionsDataSet!, this.optionsValueColumn!);
            if((arrayDifference(selectedOptions, this.selectedOptions)?.length) ?? 0 > 0){
                this.selectedOptions = selectedOptions;
                this.userUpdatedValue = false;
            }
        }
        
        if(
            updatedProperties.includes('DefaultSelectedItems') &&
            !context.mode.isVisible &&
            (
                !(context.parameters as any).DefaultSelectedItems?.raw || 
                (context.parameters as any).DefaultSelectedItems?.raw?.length == 0
            ) &&
            Items.getSelectedRecordIds().length == 0
        ){
            this.resetDefaultSelectedItems = true;
        }

        //update validation
        if(
            context.updatedProperties.includes("ValidationMessage") 
            || context.updatedProperties.includes("ValidationState")
        ){
           const pendingValidation = { 
                validationMessage: ValidationMessage.raw ?? '',
                validationState: 
                    ValidationState.raw 
                    ?? (ValidationMessage.raw ? "error" : "none"),
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
                orientation: Orientation.raw,
                size: Size.raw || "medium",
                onResize: this.onResize,
                onClick: this.onSelect,
                onValidate: this.onValidate,
                validate: Validate.raw,
                valueChanged: this.userUpdatedValue,
                pendingValidation: this.pendingValidation,
                style: {
                    height: context.mode.allocatedHeight,
                    width: context.mode.allocatedWidth
                }
            },
            /* control specific props */
            options: this.options,
            selectedOptions: this.selectedOptions,
            multiselect: Multiselect.raw ?? false,
            layout: Layout.raw || "vertical",
            isRead: isRead,
            isControlDisabled: isControlDisabled,
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
            Events: this.eventQueue.getOutput(),
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
