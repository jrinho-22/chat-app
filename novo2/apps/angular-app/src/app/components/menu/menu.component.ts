import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { ChatInputEvent } from '../inputs/chat-input/chatInput.component';
import { IUser, liveConnections } from '@novo2/types-lib';
import { UserModel } from '../../page/model/user.service';
import { WebsocketService } from '../../services/websocket/websocket.service';
import { EventTrigger } from '../../decorators/event-trigger.decorator';
import { HttpContext } from '@angular/common/http';
import { loading, loadingConfig } from 'apps/angular-app/src/token/HttpContextToken';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MatButtonModule, MatMenuModule],
  providers: [UserModel],
  exportAs: 'customMenu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.sass',
})
export class MenuComponent {
  @Input() data!: string
  @Output() clickEmitter = new EventEmitter<ChatInputEvent>();
  @ViewChild(MatMenu) menu!: MatMenu;
  user: IUser<string> | undefined

  constructor(private userModel: UserModel, private wsService: WebsocketService) {
    this.wsService.user$.subscribe(user => {this.user = user })
  }

  @EventTrigger({ message: "RELOAD_CHAT" })
  emitClick() {
    return this.userModel.putData(`add-contact/${this.wsService.userValue?._id}`, { newContact: this.data })
  }
}
