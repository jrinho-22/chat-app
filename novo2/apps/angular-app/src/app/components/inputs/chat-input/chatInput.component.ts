import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatInput.component.html',
  styleUrl: './chatInput.component.sass',
})
export class ChatInputComponent {
  protected messageInput: any
  @Output() clickEmitter = new EventEmitter<ChatInputEvent>();

  sendClickEmitter(event: Event){
    this.clickEmitter.emit({messageValue: this.messageInput});
    this.messageInput = ''
  }
}

export interface ChatInputEvent {
  messageValue: string
}