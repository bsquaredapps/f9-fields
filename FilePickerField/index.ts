import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9FilePickerField, 
    F9FilePickerFieldProps,
    F9FilePickerDefaultColumns,
    F9FilePickerFile
} from "./F9FilePickerField";
import { SelectedFileSchema, SelectedFilesSchema } from "./SelectedFiles";
import { PAEvent, PASourceEvent, getPAEvent, PAEventsSchema } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { F9FieldOnValidateEventHandler, F9FieldProps } from "../Field/F9Field";
import * as isDeepEqual from 'fast-deep-equal';
import { ValidationSchema } from "../utils/ValidationSchema";

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
    private events: PAEvent[] = [];
    private defaultFiles: F9FilePickerFile[];
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
    private dispatchOnChange: boolean = false;
    private dispatchOnSelect: boolean = false;
    private dispatchOnResize: boolean = false;
    private dispatchOnValidate: boolean = false;
    private dispatchOnError: boolean = false;

    private onChange = (ev: React.FormEvent<HTMLDivElement | HTMLButtonElement>, newFiles?: F9FilePickerFile[]) => {
        if(newFiles && ev){
            //this.events.push(getPAEvent(ev as PASourceEvent));
            this.files = newFiles;
            this.dispatchOnChange = true;
            this.notifyOutputChanged();
        }
    }
    
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

    private onFileSizeError = (error: {errorCode: string; param: number}) =>{
        const fileSizeErrorEvent: PASourceEvent = {
            type: "error",
            target: {name: error.errorCode, value: error.param.toString()}
        };
        this.events.push(getPAEvent(fileSizeErrorEvent));
        this.dispatchOnError = true;
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
        if(this.dispatchOnError){
            (context as any).events.OnError?.();
            this.dispatchOnError = false;
        }
        if(this.dispatchOnValidate){
            (context as any).events.OnValidate?.();
            this.dispatchOnValidate = false;
        }
        //clear events
        this.events.length = 0;

        //grab raw props
        this.label =  context.parameters.Label.raw || undefined;
        this.hint = context.parameters.Hint.raw || undefined;
        this.info = context.parameters.Info.raw || undefined;
        this.required = context.parameters.Required.raw;

        const defaultFiles = getFilesFromDataSet(context.parameters.DefaultFiles);
        const valueUpdated = !isDeepEqual(defaultFiles, this.defaultFiles);
        if(valueUpdated){
            this.defaultFiles = defaultFiles;
        }
        
        //initialize values if not already
        if(!this.contentHeight || !this.contentWidth || !this.files){
            if(!this.contentHeight) this.contentHeight = context.mode.allocatedHeight;
            if(!this.contentWidth) this.contentWidth = context.mode.allocatedWidth;
            if(!this.files) this.files = [...this.defaultFiles];
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
                pendingValidation: this.pendingValidation,
                style: {
                    height: context.mode.allocatedHeight,
                    width: context.mode.allocatedWidth
                }
            },
            /* control specific props */
            defaultFiles: this.defaultFiles,
            valueUpdated: valueUpdated,
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
            Events: [...this.events],
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
