import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, pipe, ReplaySubject } from 'rxjs';
import { actions, actionsType, OperatorOutput } from '../resorces/actions';
import { IUserWithContacts, liveConnections } from '@novo2/types-lib';

@Injectable({ providedIn: 'root' })
export class WorkflowsService {
    private actionsObj: actionsType = actions
    private actionsMapper = new Map<string, { sub: ReplaySubject<any>, opt?: () => OperatorFunction<any, any> }>();

    constructor() {
        Object.values(this.actionsObj).map(action => {
            if (!this.actionsMapper.has(action.label)) {
                this.actionsMapper.set(action.label, { sub: new ReplaySubject<void>(1), opt: action.opt });
            }
        })
    }

    actionTrigger(action: string, obs?: Observable<any>) {
        if (this.actionsMapper.has(action)) {
            const actionSubject$ = this.actionsMapper.get(action)?.sub
            if (obs) {
                obs.subscribe({
                    complete: () => {
                        (actionSubject$ as ReplaySubject<void>).next();
                    }
                });
            } else {
                (actionSubject$ as ReplaySubject<void>).next();
            }
        }
        console.warn("Action not found")
    }

    getActionSubject<T extends OperatorOutput<any>>(action: string): Observable<T> | null {
        if (this.actionsMapper.has(action)) {
            const actionSubject$ = this.actionsMapper.get(action)
            if (actionSubject$?.opt) {
                return actionSubject$!.sub.asObservable().pipe(actionSubject$?.opt())
            } else {
                return actionSubject$!.sub.asObservable()
            }
        }
        return null
    }
}
