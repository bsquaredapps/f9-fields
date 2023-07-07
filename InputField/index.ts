import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { F9InputField, F9InputFieldOnChangeEventHandler, F9InputFieldProps } from "./F9InputField";
import { PAEvent, PASourceEvent, getPAEvent, PAEventsSchema } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { F9FieldOnValidateEventHandler, F9FieldProps } from "../Field/F9Field";
import { ValidationSchema } from "../utils/ValidationSchema";

export class InputField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private value?: string;
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
    private dispatchOnSelect: boolean = false;
    private dispatchOnResize: boolean = false;
    private dispatchOnValidate: boolean = false;
    private debounceTimeoutId?: number;
    private debounceTimeout: number = 300;
    private debounce: IInputs["DelayOutput"]["raw"];

    private maybeDebounceNotifyOutputChanged = ()=>{
        window.clearTimeout(this.debounceTimeoutId);
        switch(this.debounce){
            case "debounce":
                this.debounceTimeoutId = window.setTimeout(() => {
                    this.notifyOutputChanged();
                }, this.debounceTimeout);
                break;
            case "onblur":
                break;
            default:
                this.notifyOutputChanged();
        }
    };

    private onBlur: React.FocusEventHandler<HTMLInputElement> = (ev) =>{
        if(this.debounce === "onblur"){
            this.notifyOutputChanged();
        }
    }

    private onChange: F9InputFieldOnChangeEventHandler = (ev, data) => {
        if(this.value !== data?.value){
            //this.events.push(getPAEvent(ev as PASourceEvent));
            this.value = data?.value;
            this.dispatchOnChange = true;
            this.maybeDebounceNotifyOutputChanged();
        }
    }
    
    private onSelect: React.MouseEventHandler<any> = (ev): void => {
        this.events.push(getPAEvent(ev as PASourceEvent));
        this.dispatchOnSelect = true;
        this.maybeDebounceNotifyOutputChanged();
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
        this.maybeDebounceNotifyOutputChanged();
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
        this.pendingValidation = { 
            validationMessage: context.parameters.ValidationMessage.raw || undefined,
            validationState: context.parameters.ValidationState.raw || "none"
        };
        this.value = context.parameters.Value.raw ?? context.parameters.DefaultValue.raw ?? undefined;
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

        //grab raw props
        this.debounceTimeout = context.parameters.DelayTimeout.raw || 300;
        this.debounce = context.parameters.DelayOutput.raw;
        this.label =  context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        
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

        //handle input value change from powerapps
        const valueInputField = context.parameters.DefaultValue.raw ? "DefaultValue" : "Value";
        const inputValue = context.parameters[valueInputField].raw || "";
        const inputValueUpdated = context.updatedProperties.includes(valueInputField);
        if(inputValueUpdated) this.value = inputValue;

        const props: F9InputFieldProps = { 
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
                pendingValidation: this.pendingValidation
            },

            /* control specific props */
            value: inputValue,
            valueUpdated: inputValueUpdated,
            placeholder: context.parameters.Placeholder.raw || undefined,
            contentBefore: context.parameters.ContentBefore.raw || undefined,
            contentAfter: context.parameters.ContentAfter.raw || undefined,
            type: context.parameters.InputType.raw,
            appearance: context.parameters.Appearance.raw || "outline",
            isRead: (context.mode as any).isRead,
            isControlDisabled: context.mode.isControlDisabled,
            onBlur: this.onBlur,
            onChange: this.onChange
        };
        return React.createElement(
            F9InputField, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Value: this.value,
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
