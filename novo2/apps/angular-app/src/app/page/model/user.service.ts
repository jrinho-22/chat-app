import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpRequestService } from '../../services/http/HttpRequest.service';
import { IUser } from '@novo2/types-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // <-- required for global access
})
export class UserModel extends HttpRequestService<IUser<string>> {
  constructor(http: HttpClient) {
    super(http);
  }

  config() {
    return {
      resource: "user",
      apiUrl: "api"
    };
  }

  getUserByName(name: string): Observable<IUser<string>> {
    return this.http.get<IUser<string>>(`${this.updatedUrl}/name/${name}`, {
      headers: this._headers,
    });
  }
}