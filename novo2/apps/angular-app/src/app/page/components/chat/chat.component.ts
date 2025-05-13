import { ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { IMessages, IUser, mongooseId } from '@novo2/types-lib';
import { ChatModel } from '../../model/chat.service';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../../../components/inputs/search-input/searchInput.component';
import { ChatInputComponent, ChatInputEvent } from '../../../components/inputs/chat-input/chatInput.component';
import { ChatMessageComponent } from '../../../components/chat-message/chatMessage.component';
import { stringify } from 'querystring';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, ChatInputComponent, ChatMessageComponent],
  providers: [ChatModel],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.sass',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  protected chatHistory: IMessages<string>[] = []
  protected messageInput: string = ""
  protected currentRoom: string | undefined
  protected roomType: "room" | "contact" | undefined
  protected roomMembers: string[] = []
  protected avatar: string = ''
  @ViewChild('scrollContainer') scrollContainer: ElementRef | undefined;

  constructor(private ws: WebsocketService, private chatModel: ChatModel) {
    this.subscribeRoom()
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }

  scrollToBottom() {
    const container = this.scrollContainer?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  getTime(date: string) {
    const dateDate = new Date(date);
    return String(dateDate.getHours().toString().padStart(2, '0') + ":" + dateDate.getMinutes().toString().padStart(2, '0'))
  }

  checkMessageSender(msg: IMessages<string>) {
    return msg.userId == this.ws.userValue?._id ? true : false
  }

  subscribeRoom() {
    this.ws.room$.subscribe(v => {
      if (v) {
        this.currentRoom = v?._id
          this.getChatHistory(v._id);
          this.roomMembers = v.members
          this.avatar = v?.avatar!
          this.roomType = v.type
      }
    })
    this.ws.listenMessages().subscribe(v => {
      this.chatHistory.push(v)
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendHandler(event: ChatInputEvent) {
    this.scrollToBottom()
    this.ws.sendMessage(event.messageValue, this.roomType!)
  }

  getChatHistory(roomId: string) {
    this.chatModel.getItem(roomId).subscribe((chat) => {
      this.chatHistory = chat
    })
  }
}
