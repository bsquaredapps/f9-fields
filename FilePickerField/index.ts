import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9FilePickerField, 
    F9FilePickerFieldProps,
    F9FilePickerDefaultColumns,
    F9FilePickerFile,
    F9FilePickerOnChangeEventHandler
} from "./F9FilePickerField";
import { SelectedFileSchema, SelectedFilesSchema } from "./SelectedFiles";
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { F9FieldOnValidateEventHandler, F9FieldProps } from "../Field/F9Field";
import { ValidationSchema } from "../utils/ValidationSchema";
import { arrayDeepDifference } from "../utils/arrayDifference";

const getFilesFromDataSet = (dataSet: ComponentFramework.PropertyTypes.DataSet, columns?: ComponentFramework.PropertyHelper.DataSetApi.Column[]) => {
    
    const files: { [key: string]: F9FilePickerFile } = {};
    dataSet.sortedRecordIds.forEach((recordId)=>{
        const record = dataSet.records[recordId];
        const fileObj: F9FilePickerFile = {} as F9FilePickerFile;

        const cols = 
            columns 
            ?? dataSet.columns?.length > 0 
                ? dataSet.columns 
                : F9FilePickerDefaultColumns;
                
        cols.forEach((column)=>{
            const colName = column.name || column.displayName;
            const colNameKey = colName.trim().toLowerCase();
            const value = record.getValue(column.name);
            fileObj[colNameKey as keyof F9FilePickerFile] = record.getValue(colName) as any;
        });
        
        if(fileObj.file){
            files[fileObj.file.fileName] = fileObj;
        }
    });

    return Object.values(files);
}

export class FilePickerField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private contentHeight?: number;
    private contentWidth?: number;
    private eventQueue: PAEventQueue;
    private files: F9FilePickerFile[];
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private pendingValidation: F9FieldProps["pendingValidation"];
    private validation: {
        Message: string;
        State: string;  
    };
    private valueChangedFromDefault: boolean = false;

    private onChange: F9FilePickerOnChangeEventHandler = (ev, newFiles) => {
        if(newFiles){
            //this.events.push(getPAEvent(ev as PASourceEvent));
            this.files = newFiles;
            this.valueChangedFromDefault = true;
            const event = {
                type: "change",
                target: ev.currentTarget,
                value: this.files.map((file)=>file.file.fileName).join("#;")
            };
            this.eventQueue.add(event, "OnChange");
            this.notifyOutputChanged();
        }
    }
    
    private onSelect: React.MouseEventHandler<any> = (event): void => {
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        this.notifyOutputChanged();
    }

    private onResize = (size?: ScrollSize, target?: React.MutableRefObject<null>): void =>{
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

    private onFileSizeError = (error: {errorCode: string; param: number}) =>{
        const event: PASourceEvent = {
            type: "error",
            target: undefined, 
            value: error.param.toString()
        };
        this.eventQueue.add(event, "OnError");
        this.notifyOutputChanged();
    }
    
    private onValidate: F9FieldOnValidateEventHandler = (targetRef, validationData) => {
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

    private pickFile = (context: ComponentFramework.Context<IInputs>)=>{
        return ()=>{
            const pick =  context.device.pickFile({
                accept: context.parameters.AcceptedTypes.raw || "any",
                allowMultipleFiles: context.parameters.AllowMultipleFiles.raw,
                maximumAllowedFileSize: context.parameters.MaxFileSize.raw || 10485760
            });
        
            pick.catch((error)=>{
                this.onFileSizeError(error);
            })
        
            return pick;
        }
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
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        //execute queued events
        this.eventQueue.execute(context);

        //grab raw props
        this.label =  context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        
        if(
            context.updatedProperties.includes('dataset') 
            || context.updatedProperties.includes('records')
            || (!this.files && context.parameters.DefaultFiles)
        ){
            const defaultFiles = getFilesFromDataSet(context.parameters.DefaultFiles);
            const defaultValueChanged = arrayDeepDifference(
                defaultFiles?.map((file)=>file.file), 
                this.files?.map((file)=>file.file)
            )?.length != 0;
            
            if(defaultValueChanged){
                this.valueChangedFromDefault = false;
                this.files = defaultFiles;
            }
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

        const props: F9FilePickerFieldProps = { 
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
                valueChanged: this.valueChangedFromDefault,
                pendingValidation: this.pendingValidation,
                style: {
                    height: context.mode.allocatedHeight,
                    width: context.mode.allocatedWidth
                }
            },
            /* control specific props */
            files: this.files,
            layout: context.parameters.Layout.raw || "vertical",
            isRead: (context.mode as any).isRead,
            isControlDisabled: context.mode.isControlDisabled,
            addFileLabel: "Add files",
            downloadFileLabel: "Download file",
            removeFileLabel: "Remove file",
            allocatedHeight: context.mode.allocatedHeight,
            allocatedWidth: context.mode.allocatedWidth,
            onChange: this.onChange,
            pickFile: this.pickFile(context)
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
        const _selectedFiles = 
            this.files
                .map(file => ({
                    File: file.file
                }));
        return { 
            SelectedFiles: _selectedFiles,
            SelectedFile: _selectedFiles[0] || {File: undefined},
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Validation: {...this.validation},
            Events: this.eventQueue.getOutput(),
            Label: this.label ?? "",
            Hint: this.hint ?? "",
            Info: this.info ?? "",
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
            SelectedFiles: SelectedFilesSchema,
            SelectedFile: SelectedFileSchema,
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
