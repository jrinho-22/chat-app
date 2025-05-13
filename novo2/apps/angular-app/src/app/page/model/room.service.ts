import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpRequestService } from '../../services/http/HttpRequest.service';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';
import { roomRequest } from '@novo2/types-lib';

@Injectable()
export class RoomModel extends HttpRequestService<roomRequest<string>["requestResponse"]> {
  constructor(http: HttpClient) {
    super(http);
  }

  config() {
    return {
      resource: "room",
      apiUrl: "api"
    };
  }

    getRoom(formData: FormGroup | FormData | Record<string, any>): Observable<roomRequest<string>["requestResponse"]> {
      return this.http.post<roomRequest<string>["requestResponse"]>(this.updatedUrl, formData, {
        // headers: this._headers,
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return throwError(() => new Error(error.message));
        })
      );
    }
}