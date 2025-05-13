import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IContactsWithUnreadMsg, IMessages, IUser, liveConnections, mongooseId } from '@novo2/types-lib';

export type UserWithUnreadMsg = (IUser<string> & { unread: number })[]
export type ConnWithUnreadMsg = (liveConnections<string> & { unread: number })[]

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
  private _roomSubject = new BehaviorSubject<{ _id: string, members: string[], avatar: string } | undefined>(undefined)
  private _room$ = this._roomSubject.asObservable();
  private _user = new BehaviorSubject<IUser<string> | undefined>(undefined)
  private _user$ = this._user.asObservable()
  private _userContactsSubject = new BehaviorSubject<IContactsWithUnreadMsg<string>[]>([])
  private _userContacts$ = this._userContactsSubject.asObservable()
  private _roomContactsSubject = new BehaviorSubject<liveConnections<string>[]>([])
  private _roomContacts$ = this._roomContactsSubject.asObservable()

  constructor() {}

  get roomContacts$() {
    return this._roomContacts$
  }

  get roomContactsSubject() {
    return this._roomContactsSubject
  }

  get roomContactsValueCopy(): liveConnections<string>[] | [] {
    return JSON.parse(JSON.stringify(this.roomContactsSubject.value || []));
  }

  get userContactsSubject() {
    return this._userContactsSubject
  }

  get UserContactValueCopy(): IContactsWithUnreadMsg<string>[] | [] {
    return JSON.parse(JSON.stringify(this.userContactsSubject.value || []));
  }

  get userContacts$() {
    return this._userContacts$
  }

  get room$() {
    return this._room$
  }

  get user$() {
    return this._user$
  }

  get userValue() {
    return this._user.value
  }

}
