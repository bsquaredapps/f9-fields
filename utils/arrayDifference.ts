import * as isDeepEqual from 'fast-deep-equal';
import * as React from 'react';

export const arrayDifference = (arr1?: any[], arr2?: any[]) => {
    if(!arr1 || arr1.length === 0) return arr2;
    if(!arr2 || arr2.length === 0) return arr1;
    if(arr1 === arr2) return [];
    return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x=> !arr1.includes(x)));
}

export const arrayDeepDifference = (arr1?: any[], arr2?: any[]) => {
    if(!arr1 || arr1.length === 0) return arr2;
    if(!arr2 || arr2.length === 0) return arr1;
    if(arr1 === arr2) return [];
    return arr1.filter(x => !arr2.find(y => isDeepEqual(x,y))).concat(arr2.filter(x=> !arr1.find(y => isDeepEqual(x,y))));
}