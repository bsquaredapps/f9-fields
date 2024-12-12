import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { F9Field, F9FieldProps } from "./F9Field";
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../../Utilities/PAEvent";
import { ScrollSize } from '../../Utilities/useScrollSize';
import * as React from "react";

interface CustomContext<T> extends ComponentFramework.Context<T>{
    events: { [key: string]: () => void};
    mode: ComponentFramework.Context<T>["mode"] & { isRead: boolean }
    parameters: ComponentFramework.Context<T>["parameters"] & { DefaultSelectedItems?: {raw: any[] | {[key: string]: any}}}
}

export class Field implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private eventQueue: PAEventQueue;
    private label: IOutputs["Label"];
    private labelWidth?: number;
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: string;
    private validationState: IInputs["ValidationState"]["raw"];
    
    private onSelect(event: React.MouseEvent<any>) {
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        this.notifyOutputChanged();
    }

    private onResize(size?: ScrollSize, target?: React.MutableRefObject<null>){
        const field = target?.current;
        if(field){
            const label = (field as HTMLDivElement).querySelector(".fui-Field__label") as HTMLElement;
            if(label){
                if(!this.labelWidth || Math.round(this.labelWidth) != label.offsetWidth){
                    this.labelWidth = label.offsetWidth;
                }
            }
        }

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
        this.validationState = context.parameters.ValidationState.raw || "none";
        this.contentHeight = context.mode.allocatedHeight ?? 0;
        this.contentWidth = context.mode.allocatedWidth ?? 0;
        this.labelWidth = 
            (context.parameters.AutoLabelWidth.raw === false && context.parameters.LabelWidth.raw)
            ? context.parameters.LabelWidth.raw  
            : context.parameters.Orientation.raw === "horizontal"
            ? context.mode.allocatedWidth / 3
            : context.mode.allocatedWidth;
        this.eventQueue = new PAEventQueue();
        this.onSelect = this.onSelect.bind(this);
        this.onResize = this.onResize.bind(this);
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
            parameters, 
            mode,
            updatedProperties
        } = context;
        
        const {
            allocatedHeight,
            allocatedWidth
        } =  mode;

        const {
            Label,
            LabelFont,
            LabelFontSize,
            LabelFontWeight,
            LabelFontColor,
            LabelWidth,
            LabelWrap,
            LabelAlign,
            Hint,
            Info,
            Required,
            ValidationMessage,
            ValidationState,
            Orientation,
            Size,
            AutoLabelWidth
        } =  parameters;
        
        //grab raw props
        this.label = Label.raw || '';
        this.hint = Hint.raw || '';
        this.info = Info.raw || '';
        this.required = Required.raw;
        this.validationMessage = ValidationMessage.raw || '';
        this.validationState = ValidationState.raw || "none";

        if(
            (
                updatedProperties.includes("LabelWidth") ||
                updatedProperties.includes("AutoLabelWidth")
            ) && AutoLabelWidth.raw === false
        ){
            this.labelWidth = LabelWidth.raw ?? this.labelWidth
        }
        const fieldProps: F9FieldProps = { 
            /* field props */
            label: this.label,
            labelFont: LabelFont.raw ?? undefined,
            labelFontSize: LabelFontSize.raw ?? undefined,
            labelFontWeight: LabelFontWeight.raw ?? undefined,
            labelFontColor: LabelFontColor.raw ?? undefined,
            labelAlign: LabelAlign.raw ?? undefined,
            labelWrap: LabelWrap.raw ?? undefined,
            labelWidth: AutoLabelWidth.raw ? "auto" : this.labelWidth,
            hint: this.hint,
            info: this.info,
            required: this.required,
            orientation: Orientation.raw,
            size: Size.raw || "medium",
            validationMessage: this.validationMessage,
            validationState: this.validationState,
            onResize: this.onResize,
            onClick: this.onSelect,
            allocatedHeight,
            allocatedWidth
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
            ValidationMessage: this.validationMessage,
            ValidationState: this.validationState,
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Events: this.eventQueue.getOutput(),
            Label: this.label,
            Hint: this.hint,
            Info: this.info,
            Required: this.required,
            LabelWidth: this.labelWidth
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
