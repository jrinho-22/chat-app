import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpRequestService } from '../../services/http/HttpRequest.service';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';
import { IMessages, IUnreadMessages, roomRequest } from '@novo2/types-lib';

@Injectable({
  providedIn: 'root' // <-- required for global access
})
export class ChatModel extends HttpRequestService<IMessages<string>[]> {
  constructor(http: HttpClient) {
    super(http);
  }

  config() {
    return {
      resource: "messages",
      apiUrl: "api"
    };
  }

  getUserUnreadMessages<T>(userId: string) {
    return this.http.get<IUnreadMessages<string>>(`${this.updatedUrl}/unread/${userId}`,
    {
      headers: this._headers,
    });
  }
}