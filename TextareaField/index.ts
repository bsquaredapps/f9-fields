import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { F9TextareaField, F9TextareaFieldOnChangeEventHandler, F9TextareaFieldProps } from "./F9TextareaField";
import { PAEvent, PASourceEvent, PASourceTarget, getPAEvent, PAEventSchema } from "../utils/PAEvent";
import { ElementSize } from '../utils/useElementSize';
import * as React from "react";


export class TextareaField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private value?: string;
    private contentHeight?: number;
    private contentWidth?: number;
    private event: PAEvent;
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: IOutputs["ValidationMessage"];
    private validationState: IInputs["ValidationState"]["raw"];
    private dispatchOnChange: boolean = false;
    private dispatchOnSelect: boolean = false;
    private dispatchOnResize: boolean = false;

    private onChange: F9TextareaFieldOnChangeEventHandler = (ev, data) => {
        if(data?.value && ev){
            this.event = getPAEvent(ev as PASourceEvent);
            this.value = data.value;
            this.dispatchOnChange = true;
            this.notifyOutputChanged();
        }
    }
    
    private onSelect: React.MouseEventHandler<any> = (ev): void => {
        this.event = getPAEvent(ev as PASourceEvent);
        this.dispatchOnSelect = true;
        this.notifyOutputChanged();
    }

    private onResize = (size?: ElementSize, target?: React.MutableRefObject<null>): void =>{
        const resizeEvent: PASourceEvent = {
            type: "resize",
            target: target as PASourceTarget
        };
        this.event = getPAEvent(resizeEvent);
        this.contentHeight = size?.height;
        this.contentWidth = size?.width;
        this.dispatchOnResize = true;
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

        if(!this.contentHeight || !this.contentWidth || (!this.value && this.value !="")){            
            if(!this.contentHeight) this.contentHeight = context.mode.allocatedHeight;
            if(!this.contentWidth) this.contentWidth = context.mode.allocatedWidth;
            if(!this.value) this.value = context.parameters.DefaultValue.raw ?? '';
            this.notifyOutputChanged();
        }

        this.label =  context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        this.validationMessage = context.parameters.ValidationMessage.raw || undefined;
        this.validationState = context.parameters.ValidationState.raw || "error";
        
        const props: F9TextareaFieldProps = { 
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
            defaultValue: context.parameters.DefaultValue.raw || "",
            placeholder: context.parameters.Placeholder.raw || undefined,
            appearance: context.parameters.Appearance.raw || "outline",
            resize: context.parameters.AllowResize.raw,
            delayOutput: context.parameters.DelayOutput.raw || "none",
            delayTimeout: context.parameters.DelayTimeout.raw || 300,
            isRead: (context.mode as any).isRead,
            isControlDisabled: context.mode.isControlDisabled,
            onChange: this.onChange
        };
        return React.createElement(
            F9TextareaField, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Value: this.value,
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
