export default class PropertyListener {
    private controlId: string;
    private controlInstanceId: string;
    private controlName: string;
    private propertyKey: string;

    static propertyRuleSubscribers: { [control: string]: { [property: string] : { [instance: string]: (bindingContext: any) => void } } };
    static defaultPropertyRules: { [control: string]: { [property: string]: (bindingContext: any)=>void } };
    static propertyRuleListeners: { [control: string]: { [proeprty: string]: (bindingContext: any)=>void } };

    constructor(controlId: string, controlInstanceId: string, controlName: string, propertyKey: string){
        this.controlId = controlId;
        this.controlInstanceId = controlInstanceId;
        this.controlName = controlName;
        this.propertyKey = propertyKey;

        PropertyListener.propertyRuleSubscribers = PropertyListener.propertyRuleSubscribers ?? {};
        PropertyListener.propertyRuleSubscribers[this.controlId] = PropertyListener.propertyRuleSubscribers[this.controlId] ?? {};
        PropertyListener.propertyRuleSubscribers[this.controlId][this.propertyKey] = PropertyListener.propertyRuleSubscribers[this.controlId][this.propertyKey] ?? {};

        PropertyListener.defaultPropertyRules = PropertyListener.defaultPropertyRules ?? {};
        PropertyListener.defaultPropertyRules[this.controlId] = PropertyListener.defaultPropertyRules[this.controlId] ?? {};

        PropertyListener.propertyRuleListeners = PropertyListener.propertyRuleListeners ?? {};
        PropertyListener.propertyRuleListeners[this.controlId] = PropertyListener.propertyRuleListeners[this.controlId] ?? {};
    }

    public listen(callback: (bindingContext: any)=>void){
        const propertyRules = (window as any).AppMagic?.AuthoringTool?.Runtime._propertyRules;
        if(propertyRules){
            const defaultPropertyRule = propertyRules[`${this.controlId}.${this.propertyKey}`];
            if(!PropertyListener.defaultPropertyRules[this.controlId][this.propertyKey] ||
                PropertyListener.propertyRuleListeners[this.controlId][this.propertyKey] != defaultPropertyRule
            ) {
                PropertyListener.defaultPropertyRules[this.controlId][this.propertyKey] = defaultPropertyRule;
            }
            if(
                !PropertyListener.propertyRuleSubscribers[this.controlId][this.propertyKey][this.controlInstanceId] ||
                PropertyListener.propertyRuleSubscribers[this.controlId][this.propertyKey][this.controlInstanceId] != callback
            ){
                PropertyListener.propertyRuleSubscribers[this.controlId][this.propertyKey][this.controlInstanceId] = callback
            }
            
            if(!PropertyListener.propertyRuleListeners[this.controlId][this.propertyKey]) {
                PropertyListener.propertyRuleListeners[this.controlId][this.propertyKey] = (...args)=>{

                    PropertyListener.defaultPropertyRules[this.controlId][this.propertyKey]?.apply(null, args);
                    const bindingContext = args[0];
                    if(bindingContext){
                        const controlContext = bindingContext.controlContexts[this.controlName];
                        const controlUniqueId = controlContext.controlWidget.control.getControlUniqueName(controlContext);
                        const fn = PropertyListener.propertyRuleSubscribers[this.controlId][this.propertyKey][controlUniqueId];
                        typeof fn === 'function' && fn.apply(null, args);
                    }
                }
            }

            if(PropertyListener.propertyRuleListeners[this.controlId][this.propertyKey] != defaultPropertyRule){
                propertyRules[`${this.controlId}.${this.propertyKey}`] = PropertyListener.propertyRuleListeners[this.controlId][this.propertyKey];
            }

        }
        
        
    }
}