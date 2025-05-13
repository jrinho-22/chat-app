import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { IContactsWithUnreadMsg, IUser, IUserWithContacts, liveConnections, mongooseId } from '@novo2/types-lib';
import { RoomModel } from '../../model/room.service';
import { SearchInputComponent } from '../../../components/inputs/search-input/searchInput.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserModel } from '../../model/user.service';
import { MenuComponent } from '../../../components/menu/menu.component';
import { WorkflowsService } from '../../../services/workflows.service';
import { action } from '../../../resorces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient, HttpContext } from '@angular/common/http';
import { loading, loadingConfig } from 'apps/angular-app/src/token/HttpContextToken';
import { BehaviorSubject, combineLatest, combineLatestWith, distinctUntilChanged, exhaustMap, filter, first, Observable, scan, switchMap, take, takeLast, tap, withLatestFrom } from 'rxjs';
import { actionsType, OperatorOutput } from '../../../resorces/actions';
import { SubjectService, UserWithUnreadMsg } from '../../../services/subjects.service';
import { ContactComponent } from './components/contact.component';
import { ContactComponentRoom } from './components/room-contact/contact.component';

@Component({
  selector: 'app-contact',
  imports: [MatButtonModule, ContactComponent, ContactComponentRoom, MatMenuModule, CommonModule, SearchInputComponent, MenuComponent],
  providers: [RoomModel, UserModel],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContactsComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  protected user: IUser<string> | undefined
  protected userContacts!: Observable<IContactsWithUnreadMsg<string>[] | undefined>
  protected roomConnections!: Observable<liveConnections<string>[] | undefined>
  protected currentRoom: mongooseId | undefined
  protected currentUrl = window.location.href
  userContactsArray: IContactsWithUnreadMsg<string>[] = [];
  roomontactsArray: liveConnections<string>[] = [];
  protected clickHandlerBind = this.clickHandler.bind(this)
  protected obs!: Observable<any>
  protected obs2!: Observable<any>
  
  constructor(
    private ws: WebsocketService,
    private roomModel: RoomModel,
    private workflowService: WorkflowsService,
    protected http: HttpClient,
    private subjectService: SubjectService
  ) {
    this.subscribeUser()
    this.subscribeChatReload()
    this.subscribe()
  }


  subscribe() {
    this.obs = this.subjectService.userContacts$.pipe(
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) == JSON.stringify(curr)
      }),
      tap(contacts => {
        // create new reference only on modified contacts
        this.userContactsArray = contacts.map(newContact => {
          const existing = this.userContactsArray.find(c => c._id === newContact._id);
          return existing && JSON.stringify(existing) == JSON.stringify(newContact) ? existing : newContact;
        });
      })
    )
    this.obs2 = this.subjectService.roomContacts$.pipe(
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) == JSON.stringify(curr)
      }),
      tap(contacts => {
        // create new reference only on modified contacts
        this.roomontactsArray = contacts?.map(newContact => {
          const existing = this.roomontactsArray.find(c => c.user._id === newContact.user._id);
          return existing && JSON.stringify(existing) == JSON.stringify(newContact) ? existing : newContact;
        });
      })
    )
  }

  trackByContactId(index: number, contact: IContactsWithUnreadMsg<string>): string {
    return contact._id;
  }

  trackByContactIdRoom(index: number, contact: liveConnections<string>): string {
    return contact.socketId;
  }

  subscribeChatReload() {
    this.workflowService.getActionSubject<OperatorOutput<actionsType["chatReload"]["opt"]>>(action.actions.chatReload.label)!
      .subscribe(([userWithContacts, live]) => {
        this.subjectService.userContactsSubject.next(userWithContacts)
        const newLive = live.map(c => {
          return { ...c, newMessage: [] }
        })
        this.subjectService.roomContactsSubject.next(
          newLive.filter(l => {
            return !userWithContacts.some(v => v.name == l.user.name)
          })
        )
      })
  }

  subscribeUser() {
    this.ws.user$.pipe(takeUntilDestroyed()).subscribe(user => {
      this.user = user
    })
  }

  clickHandler(roomType: "contact" | "room", user: IUser<string>) {
    const senderId = user._id
    const name = user.name
    const avatar = user.avatar

    // will create new room or get existing room
    this.roomModel.getRoom({ users: [senderId, this.user?._id] }).subscribe(v => {
      this.ws.updateRoom(v.roomId, [name], avatar, { userId: this.user!._id, senderId: senderId }, roomType)
    })
  }
}
