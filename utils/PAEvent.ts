import * as React from 'react';

const PAEventSchemaNode = {
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "value": {
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
}
export const PAEventSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  ...PAEventSchemaNode
};

export const PAEventsSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": {
    ...PAEventSchemaNode
  }
}
export interface PAEventTargetAttribute {
  name: string;
  value: string
}

export interface PAEventTarget {
  name?: string;
  tagName?: string;
  classList: string[];
  attributes: PAEventTargetAttribute[];
  value?: string;
}
export type PAEvent = {
  type?: string;
  target?: PAEventTarget;
  value?: string;
}

export interface PASourceTarget {
  name?: string;
  tagName?: string;
  classList?: DOMTokenList;
  attributes?: NamedNodeMap;
  value?: string;
}
export type PASourceTargetRef = React.RefObject<PASourceTarget>;

export interface PASourceEvent {
  type?: string,
  target?: PASourceTarget | PASourceTargetRef,
  value?: string
}


const isTargetRef = (target: PASourceTarget | PASourceTargetRef): target is PASourceTargetRef => {
  return 'current' in (target as PASourceTargetRef)
}

export const getPAEvent = <T extends HTMLInputElement & { name?: string }>(event?: PASourceEvent): PAEvent => {
  if (event) {
    const target = (
      event?.target && isTargetRef(event.target)
        ? event.target.current
        : event.target
    ) as T;

    const classList: string[] = [];
    const attributes: PAEventTargetAttribute[] = [];

    if (target) {
      if (target.classList) {
        for (let i = 0; i < target.classList.length; i++) {
          classList.push(target.classList[i].toString());
        }
      }

      if (target?.attributes) {
        for (let i = 0; i < target.attributes.length; i++) {
          const attr = target.attributes[i];

          attributes.push(
            { name: attr.name ?? "", value: attr.value?.toString?.() ?? "" }
          );
        }
      }
    }
    const targetValue = target?.value ?? target?.attributes?.getNamedItem("href")?.value ?? "";
    return {
      type: event.type || "",
      target: {
        name: target?.name || "",
        tagName: target?.tagName || "",
        classList: classList,
        attributes: attributes,
        value: targetValue
      },
      value: event.value ?? targetValue
    }
  }
  return {
    type: "",
    target: {
      name: "",
      tagName: "",
      classList: [],
      attributes: [],
      value: ""
    }
  };
}

export class PAEventQueue {
  private eventsQueue: [PASourceEvent, string | undefined][] = [];
  private eventExecutionQueue: Map<PAEvent, string | undefined> = new Map();

  add(event: PASourceEvent, controlEvent?: string) {
    this.eventsQueue.push([event, controlEvent]);
  }

  getOutput() {
    const events = this.eventsQueue.map(([event, eventName]) => {
      const _event = getPAEvent(event);
      this.eventExecutionQueue.set(_event, eventName);
      return _event
    });
    this.eventsQueue.length = 0;
    return events;
  }

  execute(context: any) {

    const confirmedEvents: PAEvent[] = context.parameters.Events.raw;
    const controlEvents: { [key: string]: () => void } = context.events;

    const readyEvents = new Set<string>();

    this.eventExecutionQueue.forEach((eventName, queuedEvent, map) => {

      const eventIsConfirmed = confirmedEvents?.find((confirmedEvent) => (function isEqualOrMissing(primary: any, secondary: any) {
          if (
            primary == secondary 
            || primary.Value == secondary 
            || secondary == undefined
          ) {
            return true;
          }
          if (Array.isArray(primary) && Array.isArray(secondary)) {
            for (let i = 0; i < primary.length; i++) {
              if (!isEqualOrMissing(primary[i], secondary[i])) {
                return false;
              }
            }
            return true;
          } else if (typeof primary === "object" && typeof secondary === "object") {
            for (const key in primary) {
              if (!isEqualOrMissing(primary[key], secondary[key])) {
                return false
              }
            }
            return true;
          }
          return false;
        })(confirmedEvent, queuedEvent)

      );

      if (eventIsConfirmed) {
        eventName && readyEvents.add(eventName);
        map.delete(queuedEvent);
      }
    });

    readyEvents.forEach((eventName) => {
      typeof controlEvents?.[eventName] === "function" && controlEvents[eventName]()
    });
  }
}
