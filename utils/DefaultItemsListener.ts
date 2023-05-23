export const injectListener = (rawData: any, controlId: string, callback: ()=>void) => {
    const { defaultRule, customRules, dataRuntime, monitorName } = getBsqaRules(rawData);
    if(!defaultRule || !customRules) return;

    customRules[controlId] = callback;

    const ruleInjector = (...args: any)=>{
        const controlContext = args[0];
        const { defaultRule, customRules } =
            getBsqaRules(controlContext.inputRow[controlId].DefaultSelectedItems.ruleValue);
        if(customRules){
            for(const rule of Object.values(customRules)){
                rule.apply(null, args);
            }
        }
        if(defaultRule){
            return defaultRule.apply(null, args);
        }
    }
    dataRuntime._rules[monitorName] = ruleInjector;
    return ruleInjector;
}

const getBsqaRules = (rawData: any) => {
    console.log({rawData});
    const appDataSourceName = Object.getOwnPropertyNames(rawData).find(name => name.indexOf("AppDataSource") != -1);
    if(!appDataSourceName){
        console.log("unable to find app data source");
        return {defaultRule: undefined, customRules: undefined};
    }
    
    const appDataSource = rawData[appDataSourceName];
    const { dataRuntime, monitorName } = appDataSource;
    if(!dataRuntime._rules["__bsqa_defaultRules__"]){
        dataRuntime._rules["__bsqa_defaultRules__"] = {};
    }

    if(!dataRuntime._rules["__bsqa_defaultRules__"][monitorName]){
        dataRuntime._rules["__bsqa_defaultRules__"][monitorName] = dataRuntime._rules[monitorName];
    }
    const defaultRule = dataRuntime._rules["__bsqa_defaultRules__"][monitorName];

    if(!dataRuntime._rules["__bsqa_customRules__"]){
        dataRuntime._rules["__bsqa_customRules__"] = {};
    }

    if(!dataRuntime._rules["__bsqa_customRules__"][monitorName]){
        dataRuntime._rules["__bsqa_customRules__"][monitorName] = {};
    }
    const customRules: { [key:string]: ()=>void} = dataRuntime._rules["__bsqa_customRules__"][monitorName];

    return {dataRuntime, monitorName, defaultRule, customRules}
}