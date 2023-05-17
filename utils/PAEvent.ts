export const PAEventSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "target": {
      "type": "object",
      "properties": {
          "name": {
              "type": "string"
          },
          "tagName": {
              "type": "string"
          },
          "classList": {
              "type": "array",
              "items": {
                  "type": "string"
              }
          },
          "attributes": {
              "type": "array",
              "items": {
                  "name": {
                      "type": "string"
                  },
                  "value": {
                    "type": "string"
                  }
              }
          },
          "value": {
              "type": "string"
          }
      }
    }
  }
};

export interface PAEventTargetAttribute {
  name: string;
  value?: string | number | null
}

export interface PAEventTarget {
  name?: string;
  tagName?: string;
  classList: string[];
  attributes: PAEventTargetAttribute[];
  value?: string;
}
export interface PAEvent {
  type?: string;
  target?: PAEventTarget;
}

export interface PASourceTarget {
  name?: string;
  tagName?: string;
  classList?: DOMTokenList;
  attributes?: NamedNodeMap;
  value?: string;
}

export interface PASourceEvent {
  type?: string,
  target?: PASourceTarget
}

export const getPAEvent = <T extends HTMLInputElement & {name?: string}>(event?: PASourceEvent): PAEvent =>{
  if(event){
    const target = event.target as T;

    const classList: string[] = [];
    const attributes: PAEventTargetAttribute[] = [];
  
    if(target){
      if(target.classList){
        for(let i = 0; i < target.classList.length; i++){
            classList.push(target.classList[i].toString());
        }
      }
    
      if(target.attributes){
        for(let i = 0; i < target.attributes.length; i++){
            attributes.push(target.attributes[i]);
        }
      }
    }
    return {
        type: event.type,
        target: {
            name: target?.name,
            tagName: target?.tagName,
            classList: classList,
            attributes: attributes,
            value: target?.value ?? target?.attributes?.getNamedItem("href")?.value
        }
    }
  }
  return {
    type: undefined,
    target: {
      name: undefined,
      tagName: undefined,
      classList: [],
      attributes: [],
      value: undefined
    }
  };
}
