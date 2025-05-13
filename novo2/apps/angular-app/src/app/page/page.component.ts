import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/sideMenu.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ChatComponent } from './components/chat/chat.component';
import { WebsocketService } from '../services/websocket/websocket.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { WorkflowsService } from '../services/workflows.service';
import { action } from '../resorces';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import avatars from '../resorces/avatars';
import { PaintDirective } from '../directives/paintAnimation.directive';
import { UserModel } from './model/user.service';
import { IUser } from '@novo2/types-lib';

@Component({
  selector: 'app-page',
  imports: [PaintDirective, MatButtonModule, CommonModule, SideMenuComponent, ContactsComponent, ChatComponent, FormsModule],
  templateUrl: './page.component.html',
  providers: [UserModel],
  styleUrl: './page.component.sass',
})
export class PageComponent {
  protected avatars = avatars
  protected activeAvatar: string = ''
  public chatApp: boolean = false
  public userName: string = ""
  protected avatarEnabled = true

  constructor(
    private wsService: WebsocketService,
    private userModel: UserModel
  ) { }

  setActiveAvatar(avatar: string) {
    if (!this.avatarEnabled) return
    this.activeAvatar = avatar
  }

  clickHandler2() {
    if (this.userName.length) {
      this.userModel.getUserByName(this.userName).subscribe((v) => {
        if (v) {
          this.wsService.addUser(v.name, v.avatar)
          this.chatApp = true
        } else {
          alert("Please complete your information")
        }
      })
    }
  }

  clickHandler() {
    if (!this.userName.length || !this.activeAvatar) {
      alert("Please complete your information")
    } else {
      this.wsService.addUser(this.userName, this.activeAvatar)
      this.chatApp = true
    }
  }

  obsCallback = (v: IUser<string>) => {
    if (v) {
      this.avatarEnabled = false
      this.activeAvatar = v.avatar
    } else {
      this.avatarEnabled = true
      this.activeAvatar = ""
    }
  }

  blurEvent() {
    if (this.userName.length) {
      this.userModel.getUserByName(this.userName).subscribe(this.obsCallback)
    }
  }

  getText() {
    return this.avatarEnabled ? "Choose your avatar" : "UserName found, you may skip avatar selection"
  }
}
