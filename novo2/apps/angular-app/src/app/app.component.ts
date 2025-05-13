import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { io, Socket } from 'socket.io-client';
import { WebsocketService } from './services/websocket/websocket.service';
import { RoomModel } from './page/model/room.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { WorkflowsService } from './services/workflows.service';
import { action } from './resorces';

@Component({
  imports: [RouterModule],
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {

  constructor(protected workflowService: WorkflowsService) {}

  ngAfterViewInit() {
    this.workflowService.actionTrigger(action.actions["chatReload"].label);
  }
}

