import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule],
  templateUrl: './chatMessage.component.html',
  styleUrl: './chatMessage.component.sass',
})
export class ChatMessageComponent {
  @Input() self: boolean = false
  @Input() msg: string = ""
  @Input() time: string = ""
  
}
