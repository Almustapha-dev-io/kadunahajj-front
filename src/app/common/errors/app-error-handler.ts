import { ErrorHandler, Injectable, NgZone } from "@angular/core";

import { AppError } from './app-error';
import { BadGatewayError } from './bad-gateway-error';
import { BadRequestError } from './bad-request-error';
import { NotFoundError } from './not-found-error';
import { ServerError } from './server-error';
import { UnauthorizedError } from './unauthorized-error';

import { LoaderService } from '../../services/loader.service';
import { ModalLoaderService } from '../../services/modal-loader.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from "@angular/router";
import { SessionTimeoutError } from "./session-timeout-error";
import { UnknownServerError } from "./unknown-server.errors";

@Injectable()
export class AppErrorHandler extends ErrorHandler {

  constructor(
    private loaderService: LoaderService,
    private modalLoader: ModalLoaderService,
    private notificationService: NotificationService,
    private router: Router,
    private zone: NgZone
  ) {
    super()
  }

  handleError(error: any): void {

    this.zone.run(() => {
      this.loaderService.hideLoader();
      this.loaderService.mainLoader = false;
      this.modalLoader.hideLoader();
      this.modalLoader.lgaLoader = false;
      
      if ((error instanceof SessionTimeoutError)) {
        sessionStorage.clear();
        this.router.navigateByUrl('/');
        return;
      }
    });

    if (error instanceof BadRequestError) {
      super.handleError(error);
      return this.notificationService.errorToast(error.originalError.error);
    }

    if (error instanceof NotFoundError) {
      super.handleError(error);
      return this.notificationService.errorToast(error.originalError.error);
    }

    if (error instanceof UnauthorizedError) {
      super.handleError(error);
      return this.notificationService.errorToast(error.originalError.error);
    }

    if ((error instanceof ServerError) || (error instanceof BadGatewayError)) {
      super.handleError(error);
      return this.notificationService.errorToast(error.originalError.error);
    }

    if (error instanceof SessionTimeoutError) {
      super.handleError(error);
      this.notificationService.errorToast('Sorry your session timed out. Sign in to continue.');
      return;
    }

    if (error instanceof UnknownServerError) {
      super.handleError(error);
      this.notificationService.errorToast('Could not connect to servers. Check your internet connection.');
      return;
    }

    if (error instanceof AppError) {
      console.log(error.originalError.status)
      super.handleError(error);
      return this.notificationService.errorToast(error.originalError.error);
    }
  }
}
