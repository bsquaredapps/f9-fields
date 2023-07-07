import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { F9Field, F9FieldOnValidateEventHandler, F9FieldProps } from "./F9Field";
import { PAEvent, PASourceEvent, getPAEvent, PAEventsSchema } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { ValidationSchema } from "../utils/ValidationSchema";


export class Field implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private events: PAEvent[] = [];
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
    private dispatchOnSelect: boolean = false
    private dispatchOnResize?: boolean = false;
    private dispatchOnValidate?: boolean = false;
    private valueChanged: boolean = false;
    
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
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        //dispatch events
        if(this.dispatchOnChange){
            this.dispatchOnChange = false;
            (context as any).events.OnChange;
        }
        if(this.dispatchOnSelect){
            this.dispatchOnSelect = false;
            (context as any).events.OnSelect;
        }
        if(this.dispatchOnResize){
            this.dispatchOnResize = false;
            (context as any).events.OnResize;
        }
        if(this.dispatchOnValidate){
            this.dispatchOnValidate = false;
            (context as any).events.OnValidate;
        }
        //clear events
        this.events.length = 0;

        
        //grab raw props
        this.label =  context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        this.valueChanged = context.parameters.ValueChanged.raw;
        
        //initialize content height & width
        if(!this.contentHeight || !this.contentWidth){            
            if(!this.contentHeight) this.contentHeight = context.mode.allocatedHeight;
            if(!this.contentWidth) this.contentWidth = context.mode.allocatedWidth;
            this.notifyOutputChanged();
        }

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
        
        const fieldProps: F9FieldProps = { 
            /* field props */
            label: this.label,
            hint: this.hint,
            info: this.info,
            required: this.required,
            orientation: context.parameters.Orientation.raw,
            size: context.parameters.Size.raw || "medium",
            onResize: this.onResize,
            onClick: this.onSelect,
            onValidate: this.onValidate,
            valueChanged: context.parameters.ValueChanged.raw,
            pendingValidation: this.pendingValidation,
            //validationMessage: this.pendingValidation.validationMessage,
            //validationState: this.pendingValidation.validationState
        };

        return React.createElement(
            F9Field, fieldProps
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
            Required: this.required,
            ValueChanged: this.valueChanged
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
