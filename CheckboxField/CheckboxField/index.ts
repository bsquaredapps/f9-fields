import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { F9CheckboxField, F9CheckboxFieldProps } from "./F9CheckboxField";
import { PASourceEvent, PAEventsSchema, PASourceTarget, PAEventQueue } from "../../Utilities/PAEvent";
import { ScrollSize } from '../../Utilities/useScrollSize';
import * as React from "react";
import { CheckboxOnChangeData } from "@fluentui/react-components";

interface CustomContext<T> extends ComponentFramework.Context<T>{
    events: { [key: string]: () => void};
    mode: ComponentFramework.Context<T>["mode"] & { isRead: boolean }
    parameters: ComponentFramework.Context<T>["parameters"] & { DefaultSelectedItems?: {raw: any[] | {[key: string]: any}}}
}

export class CheckboxField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private value?: boolean | "mixed";
    private contentHeight?: number;
    private contentWidth?: number;
    private controlHeight?: number;
    private controlWidth?: number;
    private eventQueue: PAEventQueue;
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
                this.debounceTimeoutId = window.setTimeout(() => {
                    this.notifyOutputChanged();
                }, this.debounceTimeout);
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

    private onChange(targetRef: React.RefObject<HTMLInputElement>, data?: CheckboxOnChangeData){
        this.value = data?.checked ?? false;
        const event = {
            type: "change",
            target: targetRef,
            value: this.value.toString()
        };
        this.eventQueue.add(event, "OnValueChange");
        this.maybeDebounceNotifyOutputChanged();
    }
    
    private onSelect(event: React.MouseEvent<any>){
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        this.maybeDebounceNotifyOutputChanged();
    }

    private onResize(size?: ScrollSize, target?: React.MutableRefObject<null>){
        this.contentHeight = size?.height;
        this.contentWidth = size?.width;
        
        const field = target?.current;
        if(field){
            const control = (field as HTMLSpanElement).querySelector("span.fui-Checkbox") as HTMLElement;
            if(control){
                
                if(!this.controlHeight || Math.round(this.controlHeight) != control.offsetHeight){
                    this.controlHeight = control.offsetHeight;
                }
                if(!this.controlWidth || Math.round(this.controlWidth) != control.offsetWidth){
                    this.controlWidth = control.offsetWidth;
                }
            }
        }

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
        this.value = context.parameters.Value.raw ?? false;
        this.validationMessage = context.parameters.ValidationMessage.raw || "";
        this.validationState = context.parameters.ValidationState.raw;
        context.mode.trackContainerResize(true);
        this.contentHeight = context.mode.allocatedHeight ?? 0;
        this.contentWidth = context.mode.allocatedWidth ?? 0;
        this.controlHeight = 
            (context.parameters.AutoControlHeight.raw === false && context.parameters.ControlHeight.raw)
            ? context.parameters.ControlHeight.raw  
            : 32;
        this.controlWidth = 
            (context.parameters.AutoControlWidth.raw === false && context.parameters.ControlWidth.raw)
            ? context.parameters.ControlWidth.raw  
            : context.mode.allocatedWidth;
        this.eventQueue = new PAEventQueue();
        this.maybeDebounceNotifyOutputChanged = this.maybeDebounceNotifyOutputChanged.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onResize = this.onResize.bind(this);
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
            Label, 
            LabelPosition,
            LabelFont,
            LabelFontSize,
            LabelFontWeight,
            LabelFontColor,
            LabelAlign,
            LabelWrap,
            Hint, 
            Info, 
            Required, 
            Value,
            Orientation, 
            ValidationMessage, 
            ValidationState,
            Size,
            DelayOutput,
            DelayTimeout,
            ControlHeight,
            ControlWidth,
            AutoControlHeight,
            AutoControlWidth,
        } = parameters;

        
        const { 
            isControlDisabled, 
            isRead, 
            isVisible, 
            allocatedHeight, 
            allocatedWidth 
        } = mode;

        //grab raw props
        this.debounceTimeout = DelayTimeout.raw || 300;
        this.debounce = DelayOutput.raw;
        this.label =  Label.raw || '';
        this.hint = Hint.raw || '';
        this.info = Info.raw || '';
        this.required = Required.raw;
        this.validationMessage = ValidationMessage.raw || '';
        this.validationState = ValidationState.raw || "none";

        //handle input value change from powerapps
        const inputValueUpdated = updatedProperties.includes("Value");
        if(inputValueUpdated){
            this.value = Value.raw ?? false;
        } 

        if(
            (
                updatedProperties.includes("ControlHeight") ||
                updatedProperties.includes("AutoControlHeight")
            ) && AutoControlHeight.raw === false
        ){
            this.controlHeight = ControlHeight.raw ?? this.controlHeight
        }
        if(
            (
                updatedProperties.includes("ControlWidth") ||
                updatedProperties.includes("AutoControlWidth")
            ) && AutoControlWidth.raw === false
        ){
            this.controlWidth = ControlWidth.raw ?? this.controlWidth
        }
        const props: F9CheckboxFieldProps = { 
            /* field props */
            fieldProps: {
                hint: this.hint,
                orientation: Orientation.raw,
                size: Size.raw || "medium",
                onResize: this.onResize,
                onClick: this.onSelect,
                validationMessage: this.validationMessage,
                validationState: this.validationState,
                allocatedHeight,
                allocatedWidth
            },

            /* control specific props */
            label: this.label,
            labelFont: LabelFont.raw ?? undefined,
            labelFontSize: LabelFontSize.raw ?? undefined,
            labelFontWeight: LabelFontWeight.raw ?? undefined,
            labelFontColor: LabelFontColor.raw ?? undefined,
            labelAlign: LabelAlign.raw ?? undefined,
            labelWrap: LabelWrap.raw ?? undefined,
            info: this.info,
            required: this.required,
            labelPosition: LabelPosition.raw ?? "after",
            checked: this.value ?? false,
            valueUpdated: inputValueUpdated,
            isRead: isRead,
            isControlDisabled: isControlDisabled,
            controlHeight: AutoControlHeight.raw ? "auto" : this.controlHeight,
            controlWidth: AutoControlWidth.raw ? "auto" : this.controlWidth,
            onBlur: this.onBlur,
            onChange: this.onChange
        };
        return React.createElement(
            F9CheckboxField, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Value: this.value == true,
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Events: this.eventQueue.getOutput(),
            Label: this.label,
            Hint: this.hint,
            Info: this.info,
            Required: this.required,
            ValidationMessage: this.validationMessage,
            ValidationState: this.validationState,
            ControlHeight: this.controlHeight,
            ControlWidth: this.controlWidth,
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
