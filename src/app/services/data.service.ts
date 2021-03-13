import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequestError } from '../common/errors/bad-request-error';
import { NotFoundError } from '../common/errors/not-found-error';
import { AppError } from '../common/errors/app-error';
import { UnauthorizedError } from '../common/errors/unauthorized-error';
import { BadGatewayError } from '../common/errors/bad-gateway-error';
import { ServerError } from '../common/errors/server-error';
import { LoaderService } from './loader.service';
import { ModalLoaderService } from './modal-loader.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private modalLoader: ModalLoaderService
  ) { }

  get(url, token: any, id?: any): Observable<any> {
    const headers = new HttpHeaders({ 'x-auth-token': token});

    return this.http.get(url + id, { observe: 'response', headers })
      .pipe(
        map(response => response.body),
        catchError(this.handleError)
      );
  }

  post(url, resource: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'x-auth-token': token});
    return this.http.post(url, resource, { observe: 'response', headers })
      .pipe(
        map(response => response.body),
        catchError(this.handleError)
      );
  }

  update(url, id: string, body: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'x-auth-token': token});
    return this.http.put(url + '/' + id, body, { observe: 'response', headers })
      .pipe(
        map(response => response.body),
        catchError(this.handleError)
      );
  }

  delete(url, id: string) {
    return this.http.delete(url + '/' + id, { observe: 'response' })
      .pipe(
        map(response => response.body),
        catchError(this.handleError)
      );
  }

  protected handleError(error: Response) {

    if (error.status === 400)
      return throwError(new BadRequestError(error));

    if (error.status === 401)
      return throwError(new UnauthorizedError(error));

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 500)
      return throwError(new ServerError(error))

    if (error.status === 504)
      return throwError(new BadGatewayError(error));

    return throwError(new AppError(error));
  }

}
