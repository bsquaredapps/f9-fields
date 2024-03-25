import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9ChoiceGroupField,
    F9ChoiceGroupFieldProps
} from "./F9ChoiceGroupField";
import {
    F9SimpleOption,
    parseOptions,
    mergeSelectedOptions
} from '../components/options/simpleOption';
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { CheckboxProps, RadioProps } from "@fluentui/react-components";
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
    private options: F9SimpleOption<CheckboxProps & RadioProps>[];
    private selectedOptions: F9SimpleOption<CheckboxProps & RadioProps>[];
    private selectedValues: string[];
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: string;
    private validationState: IInputs["ValidationState"]["raw"];

    private onChange(targetRef: React.RefObject<HTMLDivElement>, selectedValues: string[]){
        this.selectedValues = selectedValues;
        this.selectedOptions = this.options.filter((option) => selectedValues.includes(option.Value));

        const event = {
            type: "change",
            target: targetRef,
            value: this.selectedOptions.join(","),
        };
        
        this.eventQueue.add(event, "OnValueChange");
        this.notifyOutputChanged();
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

        this.validationMessage = context.parameters.ValidationMessage.raw || "";
        this.validationState = context.parameters.ValidationState.raw;
        this.contentHeight = context.mode.allocatedHeight ?? 0;
        this.contentWidth = context.mode.allocatedWidth ?? 0;
        this.eventQueue = new PAEventQueue();
        this.onResize = this.onResize.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.selectedOptions = parseOptions(context.parameters.SelectedOptions.raw);
        this.options = mergeSelectedOptions(
            parseOptions(context.parameters.Options.raw),
            this.selectedOptions
        );
        this.selectedValues = this.selectedOptions.map((option) => option.Value);
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
            Layout, 
            Orientation, 
            ValidationMessage, 
            ValidationState,
            Size,
            Multiselect
        } = parameters;
        
        const { isControlDisabled, isRead } = mode;
        
        this.label = Label.raw || '';
        this.hint = Hint.raw || '';
        this.info = Info.raw || '';
        this.required = Required.raw ?? false;
        this.validationMessage = ValidationMessage.raw || '';
        this.validationState = ValidationState.raw || "none";

        let mergeOptions = false;
        if(updatedProperties.includes('Options')){
            const newOptions: F9SimpleOption<CheckboxProps & RadioProps>[] = parseOptions(Options.raw);
            if(arrayDifference(this.options, newOptions)?.length ?? 0 > 0){
                this.options = newOptions;
                mergeOptions = true;
            }
        }
        
        if(updatedProperties.includes('SelectedOptions')){
            const newSelectedOptions: F9SimpleOption<CheckboxProps & RadioProps>[] = parseOptions(SelectedOptions.raw); 
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
                validationMessage: this.validationMessage,
                validationState: this.validationState,
                style: {
                    height: context.mode.allocatedHeight,
                    width: context.mode.allocatedWidth
                }
            },
            /* control specific props */
            options: this.options,
            selectedOptions: this.selectedValues,
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
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Events: this.eventQueue.getOutput(),
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
    }
}
