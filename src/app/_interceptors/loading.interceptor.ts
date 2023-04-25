import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, finalize, Observable } from 'rxjs';
import { BusyService } from '../_services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //set the busy spinner to on
    this.busyService.busy();
    return next.handle(request).pipe(
      delay(900),
      finalize(() => {
        //turn off the spinner once the request is complete.
        this.busyService.idle();
      })

      )
  }
}
