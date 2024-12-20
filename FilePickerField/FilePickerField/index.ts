import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9FilePickerField, 
    F9FilePickerFieldProps,
    F9FilePickerFile
} from "./F9FilePickerField";
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../../Utilities/PAEvent";
import { ScrollSize } from '../../Utilities/useScrollSize';
import * as React from "react";
import { parseJSONSafe } from "../../Utilities/parseJSONSafe";

interface CustomContext<T> extends ComponentFramework.Context<T>{
    events: { [key: string]: () => void};
    mode: ComponentFramework.Context<T>["mode"] & { isRead: boolean }
    parameters: ComponentFramework.Context<T>["parameters"] & { DefaultSelectedItems?: {raw: any[] | {[key: string]: any}}}
}

const isFileObject = (obj: any) => {
    return obj !== undefined && obj !== null && typeof obj.fileName === "string" && obj.fileName !== ""
}

const parseFiles = (json?: string | null):  F9FilePickerFile[] => {
    const parsedObject = parseJSONSafe(json ?? '[]');
    if(Array.isArray(parsedObject))
        return parsedObject.filter((file) => isFileObject(file));
    if(isFileObject(parsedObject))
        return [parsedObject]
    return [];
};

export class FilePickerField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private contentHeight?: number;
    private contentWidth?: number;
    private controlHeight?: number;
    private controlWidth?: number;
    private labelWidth?: number;
    private eventQueue: PAEventQueue;
    private files?: F9FilePickerFile[];
    private trackChanges: boolean = true;
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: string;
    private validationState: IInputs["ValidationState"]["raw"];
    private initialized: boolean = false;

    private onChange(ev: React.FormEvent<HTMLDivElement | HTMLButtonElement>, newFiles: F9FilePickerFile[]){
        this.files = newFiles;
        const event = {
            type: "change",
            target: ev.currentTarget,
            value: this.files.map((file)=>file.fileName).join("#;")
        };
        this.eventQueue.add(event, "OnValueChange");
        this.notifyOutputChanged();
    }
    
    private onSelect(event: React.MouseEvent<any>){
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        this.notifyOutputChanged();
    }

    private onResize(size?: ScrollSize, target?: React.MutableRefObject<null>){
        
        const field = target?.current;
        if(field){
            const control = (field as HTMLDivElement).querySelector("div.fui-FilePicker") as HTMLElement | null;
            if(control){
                if(!this.controlHeight || Math.round(this.controlHeight) != control.offsetHeight){
                    this.controlHeight = control.offsetHeight;
                }
                if(!this.controlWidth || Math.round(this.controlWidth) != control.offsetWidth){
                    this.controlWidth = control.clientWidth;
                }
            }
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

    private onFileSizeError(error: {errorCode: string; param: number}){
        const event: PASourceEvent = {
            type: "error",
            target: undefined, 
            value: error.param.toString()
        };
        this.eventQueue.add(event, "OnError");
        this.notifyOutputChanged();
    }

    private pickFile(){
        
        const { device, parameters } = this.context;

        const {
            AcceptedTypes,
            AllowMultipleFiles,
            MaxFileSize
        } = parameters;


        const onError = function onError(this: FilePickerField, error: any): void{
            this.onFileSizeError(error);
        };
        onError.bind(this);
        
        const pick = device.pickFile({
            accept: AcceptedTypes.raw || "any",
            allowMultipleFiles: AllowMultipleFiles.raw,
            maximumAllowedFileSize: MaxFileSize.raw || 10485760
        });
        pick.catch(onError);
        return pick;
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
            : context.parameters.Orientation.raw === "horizontal"
            ? context.mode.allocatedWidth / 3 * 2
            : context.mode.allocatedWidth;
        this.labelWidth = 
            (context.parameters.AutoLabelWidth.raw === false && context.parameters.LabelWidth.raw)
            ? context.parameters.LabelWidth.raw  
            : context.parameters.Orientation.raw === "horizontal"
            ? context.mode.allocatedWidth / 3
            : context.mode.allocatedWidth;
        this.eventQueue = new PAEventQueue();
        this.onResize = this.onResize.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.onFileSizeError = this.onFileSizeError.bind(this);
        this.files = parseFiles(context.parameters.Files.raw);
        this.trackChanges = context.parameters.TrackChanges.raw ?? true;
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
            updatedProperties,
            parameters,
            mode
        } = context;

        const {
            Files,
            ValidationMessage,
            ValidationState,
            Label,
            LabelFont,
            LabelFontSize,
            LabelFontWeight,
            LabelFontColor,
            LabelAlign,
            LabelWidth,
            LabelWrap,
            Info,
            Hint,
            Required,
            Orientation,
            Size,
            Layout,
            ControlHeight,
            ControlWidth,
            AutoControlHeight,
            AutoControlWidth,
            AutoLabelWidth
        } = parameters;

        const {
            isRead,
            isControlDisabled,
            allocatedHeight,
            allocatedWidth
        } = mode;

        this.context = context;
    
        //grab raw props
        this.label =  Label.raw || '';
        this.hint = Hint.raw || '';
        this.info = Info.raw || '';
        this.required = Required.raw;
        this.validationMessage = ValidationMessage.raw || '';
        this.validationState = ValidationState.raw || "none";

        if(updatedProperties.includes("Files")){
            this.files = parseFiles(Files.raw)
        }
        
        this.trackChanges = context.parameters.TrackChanges.raw ?? true;

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
        if(
            (
                updatedProperties.includes("LabelWidth") ||
                updatedProperties.includes("AutoLabelWidth")
            ) && AutoLabelWidth.raw === false
        ){
            this.labelWidth = LabelWidth.raw ?? this.labelWidth
        }

        const props: F9FilePickerFieldProps = { 
            /* field props */
            fieldProps: {
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
                onResize: this.onResize,
                onClick: this.onSelect,
                validationMessage: this.validationMessage,
                validationState: this.validationState,
                allocatedHeight,
                allocatedWidth
            },
            /* control specific props */
            files: this.files,
            trackChanges: this.trackChanges,
            layout: Layout.raw || "vertical",
            isRead: isRead,
            isControlDisabled: isControlDisabled,
            addFileLabel: "Add files",
            downloadFileLabel: "Download file",
            removeFileLabel: "Remove file",
            allocatedHeight: allocatedHeight,
            allocatedWidth: allocatedWidth,
            controlHeight: AutoControlHeight.raw ? "auto" : this.controlHeight,
            controlWidth: AutoControlWidth.raw ? "auto" : this.controlWidth,
            onChange: this.onChange,
            pickFile: this.pickFile
        };
        
        return React.createElement(
            F9FilePickerField, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Files: JSON.stringify(this.files),
            TrackChanges: this.trackChanges,
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Events: this.eventQueue.getOutput(),
            Label: this.label ?? "",
            Hint: this.hint ?? "",
            Info: this.info ?? "",
            Required: this.required,
            ValidationMessage: this.validationMessage,
            ValidationState: this.validationState,
            ControlHeight: this.controlHeight,
            ControlWidth: this.controlWidth,
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
        this.files = undefined;
    }
}
