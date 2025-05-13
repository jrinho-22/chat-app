import { inject, Injector } from '@angular/core';
import { WorkflowsService } from '../services/workflows.service';
import { action } from '../resorces';
import { getAppInjector } from '../app-injector';
import { Observable } from 'rxjs';

type IEventTrigger = {
    message: string
    payload?: any
}

export const EventTrigger = (arg: IEventTrigger) => {
    return function (target: Object, propertyName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Observable<any>>) {

        const originalMethod: (...args: any[]) => Observable<any> = descriptor.value!

        descriptor.value = function (...args: any[]) {
            const workflowService = getAppInjector().get(WorkflowsService);
            const result = originalMethod.apply(this, args);
            workflowService.actionTrigger(action.actions["chatReload"]!.label, result)
            return result;
        }

        return descriptor
    }
}


// const eventTrigger = (target: Object, propertyName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => number>) => {
//     // Store Original Method Implemetation
//     // Object.defineProperty(descriptor, "value", {writable: false});

//     const originalMethod: (...args: any[]) => number = descriptor.value!
//     // Now, over-write the original method
//     descriptor.value = function (...args: any[]) {
//         console.log('runnnnnnnnnnnn', this, target)
//         const result = originalMethod.apply(this, args);
//         return result;
//     }
//     return descriptor;
// }