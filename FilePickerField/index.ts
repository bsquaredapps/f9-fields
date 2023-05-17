import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9FilePickerField, 
    F9FilePickerFieldProps,
    F9FilePickerDefaultColumns,
    F9FilePickerFile
} from "./F9FilePickerField";
import { SelectedFileSchema, SelectedFilesSchema } from "./SelectedFiles";
import { PAEvent, PASourceEvent, PASourceTarget, getPAEvent, PAEventSchema } from "../utils/PAEvent";
import { ElementSize } from '../utils/useElementSize';
import { saveAs } from 'file-saver';
import * as React from "react";

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
            const colNameKey = column.name.toLowerCase();
            const value = record.getValue(column.name);
            fileObj[column.name.trim().toLowerCase() as keyof F9FilePickerFile] = record.getValue(column.name) as any;
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
    private event: PAEvent;
    private defaultFiles: F9FilePickerFile[];
    private files: F9FilePickerFile[];
    private label: IOutputs["Label"];
    private hint: IOutputs["Hint"];
    private info: IOutputs["Info"];
    private required: IOutputs["Required"];
    private validationMessage: IOutputs["ValidationMessage"];
    private validationState: IInputs["ValidationState"]["raw"];
    private notifyOnChange?: ()=>void;
    private notifyOnSelect?: ()=>void;
    private notifyOnResize?: ()=>void;
    private notifyOnError?: ()=>void;

    private onChange = (ev: React.FormEvent<HTMLDivElement | HTMLButtonElement>, newFiles?: F9FilePickerFile[]) => {
        if(newFiles && ev){
            this.event = getPAEvent(ev as PASourceEvent);
            this.files = newFiles;
            this.notifyOutputChanged();
            this.notifyOnChange?.();
        }
    }
    
    private onSelect: React.MouseEventHandler<any> = (ev): void => {
        this.event = getPAEvent(ev as PASourceEvent);
        this.notifyOutputChanged();
        this.notifyOnSelect?.();
    }

    private onResize = (size?: ElementSize, target?: React.MutableRefObject<null>): void =>{
        const resizeEvent: PASourceEvent = {
            type: "resize",
            target: target as PASourceTarget
        };
        this.event = getPAEvent(resizeEvent);
        this.contentHeight = size?.height;
        this.contentWidth = size?.width;
        this.notifyOutputChanged();
        this.notifyOnResize?.();
    }

    private onFileSizeError = (error: {errorCode: string; param: number}) =>{
        const fileSizeErrorEvent: PASourceEvent = {
            type: "error",
            target: {name: error.errorCode, value: error.param.toString()}
        };
        
        this.event = getPAEvent(fileSizeErrorEvent);
        this.notifyOutputChanged();
        this.notifyOnError?.();
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
        //attach event notifiers
        this.notifyOnChange = (context as any).events.OnChange;
        this.notifyOnSelect = (context as any).events.OnSelect;
        this.notifyOnResize = (context as any).events.OnResize;
        this.notifyOnError = (context as any).events.OnError;

        //convert options and default selected options
        this.defaultFiles = getFilesFromDataSet(context.parameters.DefaultFiles);

        //initialize values if not already
        if(!this.contentHeight || !this.contentWidth || !this.files){
            if(!this.contentHeight) this.contentHeight = context.mode.allocatedHeight;
            if(!this.contentWidth) this.contentWidth = context.mode.allocatedWidth;
            if(!this.files) this.files = [...this.defaultFiles];
            this.notifyOutputChanged();
        }
        

        this.label =  context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;
        this.validationMessage = context.parameters.ValidationMessage.raw || undefined;
        this.validationState = context.parameters.ValidationState.raw || "error";
        
        const props: F9FilePickerFieldProps = { 
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
            defaultFiles: this.defaultFiles,
            layout: context.parameters.Layout.raw || "vertical",
            isRead: (context.mode as any).isRead,
            isControlDisabled: context.mode.isControlDisabled,
            addFileLabel: "Add files",
            downloadFileLabel: "Download file",
            removeFileLabel: "Remove file",
            allocatedHeight: context.mode.allocatedHeight,
            allocatedWidth: context.mode.allocatedWidth,
            onChange: this.onChange,
            pickFile: ()=>{
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
                    File: file.file, 
                    Description: file.description
                }));
        return { 
            ContentHeight: this.contentHeight,
            ContentWidth: this.contentWidth,
            Event: this.event,
            SelectedFiles: _selectedFiles,
            SelectedFile: _selectedFiles[0] || {File: null, Description: null},
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
            Event: PAEventSchema,
            SelectedFiles: SelectedFilesSchema,
            SelectedFile: SelectedFileSchema
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
