import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, finalize, Observable, tap } from "rxjs";
import { LoadingService } from "../loading.service";
import { loading, loadingConfig } from "apps/angular-app/src/token/HttpContextToken";

@Injectable()
export class HttpInterceptorService
    implements HttpInterceptor {
    constructor(private loadingService: LoadingService) {
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const loadingContext = req.context.get(loading)
        const loadingConfigContext = req.context.get(loadingConfig)

        if (!loadingContext) {
            return next.handle(req);
        }

        this.loadingService.loadingOn(loadingConfigContext!);

        return next.handle(req).pipe(
            tap(res => console.log(res, 'resss')),
            delay(2000),
            finalize(() => {
                this.loadingService.loadingOff(loadingConfigContext!);
            })
        )
    }
}