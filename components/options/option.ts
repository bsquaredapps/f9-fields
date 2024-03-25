import { PersonaProps } from '@fluentui/react-components';

export const F9OptionDefaultColumns = [
    { name: "Value", displayName: "Value", dataType: "string" },
    { name: "Text", displayName: "Value", dataType: "string" },
    { name: "Group", displayName: "Value", dataType: "string" },
    { name: "Persona", displayName: "Value", dataType: "Object" },
    { name: "Props", displayName: "Value", dataType: "Object" },
]

export type F9Option<T> = {
    __recordId: string;
    value: string;
    text?: string;
    group?: string;
    persona?: PersonaProps;
    props?: T;
}

export const getOptionsFromDataSet = <T>(
    dataSet: ComponentFramework.PropertyTypes.DataSet, 
    columns?: ComponentFramework.PropertyHelper.DataSetApi.Column[]
) => {
    
    const options: F9Option<T>[] = [];
    const optionValues: Set<string> = new Set<string>();
    dataSet.sortedRecordIds.forEach((recordId)=>{
        const record = dataSet.records[recordId];
        const option: F9Option<T> = {} as F9Option<T>;
        const cols = 
            columns 
            ?? dataSet.columns?.length > 0 
                ? dataSet.columns 
                : F9OptionDefaultColumns;

        cols.forEach((column)=>{
            const colNameKey = column.name.trim().toLowerCase();
            const value = record.getValue(column.name)?.toString();
            option[colNameKey as keyof F9Option<T>] = value as any;
            option["__recordId"] = record.getRecordId();
        });
        if(option.value && !optionValues.has(option.value)){
            options.push(option);
            optionValues.add(option.value);
        }
    });
    return options;
}

export const getSelectedOptionsFromRecords = (
    dataSet: ComponentFramework.PropertyTypes.DataSet,
    column: string
) => {
    return dataSet?.getSelectedRecordIds()?.map((recordId) => { 
        return dataSet.records[recordId].getValue(column ?? "Value")?.toString()
    })
}

export const getSelectedRecordsFromOptions = <T>(
    dataSet?: ComponentFramework.PropertyTypes.DataSet, 
    selectedValues?: string[], 
    options?: F9Option<T>[], 
    column?: string
): string[] => {

    if(!dataSet || !options || !column || !selectedValues)
        return [];
    const currentSelectedRecords: { [key: string]: string} = {};
    dataSet
        .getSelectedRecordIds()?.forEach((recordId) => { 
            currentSelectedRecords[dataSet.records[recordId].getValue(column)?.toString()] = recordId;
        });

    return selectedValues.map((value) => {
        if(currentSelectedRecords[value])
            return currentSelectedRecords[value];
        return options.find((option) => option.value == value)?.__recordId || ""
    })
    .filter((option) => {return option != ""});
}

export const getValueColumn = (columns?: ComponentFramework.PropertyHelper.DataSetApi.Column[]): string =>{
    const cols = columns && columns.length && columns.length > 0 
                ? columns 
                : F9OptionDefaultColumns;
    return cols.find((column) => column.name.trim().toLowerCase() == "value")?.name || "Value";
}

export const SelectedSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "Values": {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    }
};
