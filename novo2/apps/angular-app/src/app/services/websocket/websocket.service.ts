import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessages, IMessagesReceived, IUser, liveConnections } from '@novo2/types-lib';
import { environment } from '../../environments/environment';
import { SubjectService } from '../subjects.service';
import { changeNotification } from '../../helpers/contactsNotifications';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private _ws: Socket
  private _roomSubject = new BehaviorSubject<{ _id: string, members: string[], avatar: string, type: "room" | "contact" } | undefined>(undefined)
  private _room$ = this._roomSubject.asObservable();
  private _user = new BehaviorSubject<IUser<string> | undefined>(undefined)
  private _user$ = this._user.asObservable()

  constructor() {
    this._ws = io(environment.wsServer)
    this._ws.on('user-registered', (data: IUser<string>) => {
      this._user.next(data)
    })
  }

  listenMessages(): Observable<IMessages<string>> {
    return new Observable((observer) => {
      this._ws.on('new-message', (messageReceived: IMessagesReceived) => {

        // update chat in real time if room is opened
        if (messageReceived.roomId == this._roomSubject.value?._id) {
          observer.next(messageReceived)

          // check if the user itself not send it, type 'room' also dont store on the not-Read table  
          if (messageReceived.roomType == "contact"
            && messageReceived.userId != this._user.value?._id) {

            // read messaeg intantly
            this._ws.emit("read-message", messageReceived.msgId)
          }
        } else {
          changeNotification(messageReceived.userId, messageReceived.roomType, "add", messageReceived)
        }
      });
    });
  }

  listenLiveConnections(): Observable<liveConnections<string>[]> {
    return new Observable((observer) => {
      this._ws.on('liveConnections', (data: liveConnections<string>[]) => {
        const filteredData = data.filter(data => data.user.name !== this._user.value?.name)
        observer.next(filteredData);
      });
    });
  }

  sendMessage(messageContent: string) {
    if (!messageContent || !this._user.value || !this._roomSubject.value?._id) return
    const messageObj: Omit<IMessages<string>, "_id"> = {
      userId: this._user.value._id,
      roomId: this._roomSubject.value._id,
      content: messageContent,
      created: new Date()
    }
    this._ws.emit("message-sent", messageObj)
  }

  addUser(name: string, avatar: string) {
    this._ws.emit("login-user", { userName: name, avatar })
  }

  addRoomUser(name: string) {
    this._ws.emit("login-room-user", name)
  }

  updateRoom(roomId: string, members: string[], avatar: string, ids: { userId: string, senderId: string }, roomType: "contact" | "room") {
    this._ws.emit("read-all-messages", ids)
    changeNotification(ids.senderId, roomType, "erase")
    this._roomSubject.next({ _id: roomId, members: members, avatar: avatar, type: roomType })
  }

  get room$() {
    return this._room$
  }

  get ws() {
    return this._ws
  }

  get user$() {
    return this._user$
  }

  get userValue() {
    return this._user.value
  }

}
