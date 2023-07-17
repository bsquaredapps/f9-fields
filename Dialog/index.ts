import { IInputs, IOutputs } from "./generated/ManifestTypes";
/* import { PAEvent, PASourceEvent, PASourceTarget, getPAEvent, PAEventSchema, PAEventsSchema } from "../utils/PAEvent"; */
import * as React from "react";
import { F9Dialog, F9DialogAction, F9DialogActionDefaultColumns } from "./F9Dialog";
import { DialogProps } from "@fluentui/react-components";
import * as DOMPurify from "dompurify";

const getActionsFromDataSet = <T>(dataSet: ComponentFramework.PropertyTypes.DataSet, columns?: ComponentFramework.PropertyHelper.DataSetApi.Column[]) => {
    const actions: F9DialogAction[] = [];
    const actionKeys: Set<string> = new Set();

    dataSet.sortedRecordIds.forEach((recordId)=>{
        const record = dataSet.records[recordId];
        const action = {} as F9DialogAction;
        const cols = 
            columns 
            ?? dataSet.columns?.length > 0 
                ? dataSet.columns 
                : F9DialogActionDefaultColumns;

        cols.forEach((column)=>{
            const colName = column.name ?? column.displayName;
            const colNameKey = colName.trim().toLowerCase();
            const value = record.getValue(colName)?.toString();
            action[colNameKey as keyof F9DialogAction] = value as any;
            action["__recordId"] = record.getRecordId();
        });

        if(action.key && !actionKeys.has(action.key)){
            actions.push(action);
            actionKeys.add(action.key);
        }
    });
    return actions;
}


export class Dialog implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private open: boolean;
    private actionsDataSet: ComponentFramework.PropertyTypes.DataSet;
    private actions: F9DialogAction[];
    private title: string;
    private content: string;

    private onOpenChange: DialogProps["onOpenChange"] = (ev, data) => {
        this.open = data.open;
        this.notifyOutputChanged();
    }

    private onSelectAction = (action: F9DialogAction) => {
        this.actionsDataSet.setSelectedRecordIds([action.__recordId]);
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
        this.open = context.parameters.IsOpen.raw;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        if(context.updatedProperties.includes('IsOpen')){
            this.open = context.parameters.IsOpen.raw
        }
        if(context.updatedProperties.includes('Title') || this.title === undefined){
            this.title = DOMPurify.sanitize(context.parameters.Title.raw ?? '');
        }

        if(context.updatedProperties.includes('Content') || this.content === undefined){
            this.content = DOMPurify.sanitize(context.parameters.Content.raw ?? '');
        }
        
        if(
            context.updatedProperties.includes('records') || 
            context.updatedProperties.includes('dataset') || 
            context.updatedProperties.includes('Actions') || 
            !this.actionsDataSet
        ){
            this.actionsDataSet = context.parameters.Actions;
            this.actions = getActionsFromDataSet(this.actionsDataSet);
        }

        const props = {
            title: this.title,
            content: this.content,
            actionsPosition: context.parameters.ActionsPosition.raw,
            actions: this.actions,
            modalType: context.parameters.ModalType.raw,
            open: this.open,
            onOpenChange: this.onOpenChange,
            onSelectAction: this.onSelectAction
        };
        return React.createElement(
            F9Dialog, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            Title: this.title,
            Content: this.content,
            IsOpen: this.open
        };
    }

    /**
     * It is called by the framework prior to a control init to get the output object(s) schema
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns an object schema based on nomenclature defined in manifest
     */
    /* public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> {
        return Promise.resolve({
            Events: PAEventsSchema
        });
    }
 */
    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
