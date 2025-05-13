import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { IUser } from '@novo2/types-lib';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule],
  templateUrl: './sideMenu.component.html',
  styleUrl: './sideMenu.component.sass',
})
export class SideMenuComponent {
  protected user!: IUser<string>
  constructor(private ws: WebsocketService) {
    ws.user$.subscribe(user => {
      this.user = user!
    })
  }
}
