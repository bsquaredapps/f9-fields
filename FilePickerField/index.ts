import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { 
    F9FilePickerField, 
    F9FilePickerFieldProps,
    F9FilePickerDefaultColumns,
    F9FilePickerFile
} from "./F9FilePickerField";
import { SelectedFileSchema, SelectedFilesSchema } from "./SelectedFiles";
import { PASourceEvent, PAEventsSchema, PAEventQueue, PASourceTarget } from "../utils/PAEvent";
import { ScrollSize } from '../utils/useScrollSize';
import * as React from "react";
import { F9FieldOnValidateData, F9FieldProps } from "../Field/F9Field";
import { ValidationSchema } from "../utils/ValidationSchema";
import { arrayDeepDifference } from "../utils/arrayDifference";

interface CustomContext<T> extends ComponentFramework.Context<T>{
    events: { [key: string]: () => void};
    mode: ComponentFramework.Context<T>["mode"] & { isRead: boolean }
    parameters: ComponentFramework.Context<T>["parameters"] & { DefaultSelectedItems?: {raw: any[] | {[key: string]: any}}}
}

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
    private context: ComponentFramework.Context<IInputs>;
    private contentHeight?: number;
    private contentWidth?: number;
    private eventQueue: PAEventQueue;
    private files?: F9FilePickerFile[];
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
    private initialized: boolean = false;

    private onChange(ev: React.FormEvent<HTMLDivElement | HTMLButtonElement>, newFiles: F9FilePickerFile[]){
        if(newFiles){
            this.files = newFiles;
            this.valueChangedFromDefault = true;
            const event = {
                type: "change",
                target: ev.currentTarget,
                value: this.files.map((file)=>file.file.fileName).join("#;")
            };
            this.eventQueue.add(event, "OnChange");
            if(this.initialized) this.notifyOutputChanged();
        }
    }
    
    private onSelect(event: React.MouseEvent<any>){
        this.eventQueue.add(event as PASourceEvent, "OnSelect")
        if(this.initialized) this.notifyOutputChanged();
    }

    private onResize(size?: ScrollSize, target?: React.MutableRefObject<null>){
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
        if(this.initialized) this.notifyOutputChanged();
    }

    private onFileSizeError(error: {errorCode: string; param: number}){
        const event: PASourceEvent = {
            type: "error",
            target: undefined, 
            value: error.param.toString()
        };
        this.eventQueue.add(event, "OnError");
        if(this.initialized) this.notifyOutputChanged();
    }
    
    private onValidate(targetRef: React.RefObject<HTMLElement>, validationData: F9FieldOnValidateData){
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
        if(this.initialized) this.notifyOutputChanged();
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
        this.onValidate = this.onValidate.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.onFileSizeError = this.onFileSizeError.bind(this);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: CustomContext<IInputs>): React.ReactElement {
        const {
            updatedProperties,
            parameters,
            mode
        } = context;

        const {
            DefaultFiles,
            ValidationMessage,
            ValidationState,
            Label,
            Info,
            Hint,
            Required,
            Orientation,
            Size,
            Validate,
            Layout,
        } = parameters;

        const {
            isRead,
            isControlDisabled,
            allocatedHeight,
            allocatedWidth
        } = mode;

        this.context = context;
        //execute queued events
        if(this.initialized)
            this.eventQueue.execute(context);
    
        //grab raw props
        this.label =  Label.raw || undefined;
        this.hint = Hint.raw || undefined;
        this.info = Info.raw || undefined;
        this.required = Required.raw;

        if(DefaultFiles.error && !this.files){
            this.files = [];
            this.initialized = true;
        } else if (
            updatedProperties.includes('dataset') 
            || updatedProperties.includes('records')
            || (DefaultFiles.paging.totalResultCount > -1 && !this.files)
        ){ 
            const defaultFiles = getFilesFromDataSet(DefaultFiles);
            const defaultValueChanged = arrayDeepDifference(
                defaultFiles?.map((file)=>file.file), 
                this.files?.map((file)=>file.file)
            )?.length != 0;
            
            if(defaultValueChanged){
                this.valueChangedFromDefault = false;
                this.files = defaultFiles;
                this.initialized = true;
            }
        }
        
        //update validation
        if(
            updatedProperties.includes("ValidationMessage") 
            || updatedProperties.includes("ValidationState")
        ){
           const pendingValidation = { 
                validationMessage: ValidationMessage.raw ?? '',
                validationState: 
                    ValidationState.raw 
                    ?? (ValidationMessage.raw ? "error" : "none"),
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
                orientation: Orientation.raw,
                size: Size.raw || "medium",
                onResize: this.onResize,
                onClick: this.onSelect,
                onValidate: this.onValidate,
                validate: Validate.raw,
                valueChanged: this.valueChangedFromDefault,
                pendingValidation: this.pendingValidation,
                style: {
                    height: allocatedHeight,
                    width: allocatedWidth
                }
            },
            /* control specific props */
            files: this.files,
            layout: Layout.raw || "vertical",
            isRead: isRead,
            isControlDisabled: isControlDisabled,
            addFileLabel: "Add files",
            downloadFileLabel: "Download file",
            removeFileLabel: "Remove file",
            allocatedHeight: allocatedHeight,
            allocatedWidth: allocatedWidth,
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
        const _selectedFiles = 
            this.files?.map(file => ({
                    File: file.file
                })) ?? [];
        return { 
            ...(
                this.initialized 
                ? {
                    SelectedFiles: _selectedFiles,
                    SelectedFile: _selectedFiles[0] || {File: undefined},
                }
                :{}
            ),
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
        this.files = undefined;
    }
}
