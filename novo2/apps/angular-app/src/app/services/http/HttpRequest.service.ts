import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, combineLatest, combineLatestWith, concat, concatMap, delay, from, interval, map, of, retry, retryWhen, switchMap, takeWhile, tap, throwError, timer } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { loading, loadingConfig } from 'apps/angular-app/src/token/HttpContextToken';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class HttpRequestService<T> {
  private _config: { resource: string } = { resource: '' };
  protected _headers: HttpHeaders | undefined;

  constructor(protected http: HttpClient) {
    this._config = this.config();
  }

  get updatedUrl() {
    console.log(environment.serverPath, environment.prefix)
    return this._config.resource.length ?
      `${environment.serverPath}/${environment.prefix}/${this._config.resource}` :
      `${environment.serverPath}`
  }

  // typeof resources[keyof typeof resources] accept all return types containning in resources
  abstract config(): { resource: string, apiUrl: string };

  getData(params?: any): Observable<T[]> {
    return this.http.get<T[]>(`${this.updatedUrl}`, {
      // headers: this._headers,
      params: params,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
        // .pipe(
        //   delay(3000)  // 2000 milliseconds = 2 seconds
        // );
      })
    );
  }

  getItem<overideT = T>(id: any, options?: { params?: any; context?: HttpContext }): Observable<overideT> {
    return this.http.get<overideT>(`${this.updatedUrl}/${id}`, {
      headers: this._headers,
      params: options?.params,
      context: options?.context
    });
  }

  getDataa(): Observable<Blob> {
    return this.http.get(this.updatedUrl, { responseType: 'blob' });
  }

  deleteData(id: string): Observable<T> {
    return this.http.delete<T>(`${this.updatedUrl}/${id}`, {
      headers: this._headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error from catchError'));
      })
    );
  }

  postData(formData: FormGroup | FormData | Record<string, any>): Observable<T> {
    return this.http.post<T>(this.updatedUrl, formData, {
      headers: this._headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error from catchError'));
      })
    );
  }

  putData(id: number | string, formData: FormGroup | FormData | Record<string, any>, options?: { params?: any; context?: HttpContext }): Observable<T> {
    return this.http.put<T>(`${this.updatedUrl}/${id}`, formData, {
      headers: this._headers,
      params: options?.params,
      context: options?.context
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('error'));
      })
    );;
  }
}
