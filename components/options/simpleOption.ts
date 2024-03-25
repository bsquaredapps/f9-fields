import { PersonaProps } from "@fluentui/react-components";
import { parseJSONSafe } from "../../utils/parseJSONSafe";

export type F9SimpleOption<T> = {
    Value: string;
    Text?: string;
    Group?: string;
    Persona?: PersonaProps;
    Props?: T;
}

const parseObjectValue = (objValue: any) => {
    if(typeof objValue === "object" && objValue !== null){
        const { Value } = objValue;
        
        const stringValue = Value !== null && Value.toString !== undefined
                            ? Value.toString() 
                            : Value;
        return {...objValue, Value: stringValue};
    }

    const stringValue = objValue !== undefined && objValue !== null 
                    ? objValue.toString() 
                    : objValue;
    return {Value: stringValue};
}

export const parseOptions = (json?: string | null) =>{
    const parsedObject = parseJSONSafe(json || '[]');
    if(parsedObject === undefined || parsedObject === null) 
        return [];

    if(Array.isArray(parsedObject)){

        return parsedObject.map((option) => {
            return parseObjectValue(option)
        }).filter((option) => {
            return option.Value !== undefined && option.Value !== null
        });
    }
        

    const sanitizedObject = parseObjectValue(parsedObject);

    if(sanitizedObject.Value !== null && sanitizedObject.Value !== undefined )
        return [sanitizedObject];

        return [];
}

export const mergeSelectedOptions = (options: F9SimpleOption<any>[], selectedOptions: F9SimpleOption<any>[]) => {
    const injectedOptions: F9SimpleOption<any>[] = [];
    selectedOptions.forEach((selectedOption) => {
        const addOption = options.findIndex((option) => option.Value === selectedOption.Value) === -1;
        if(addOption){
            injectedOptions.push(selectedOption);
        }
    });
    if(injectedOptions.length === 0){
        return options;
    }
    return [...options, ...injectedOptions]
}
