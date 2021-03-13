import { ErrorHandler, Injectable } from "@angular/core";

import { AppError } from './app-error';
import { BadGatewayError } from './bad-gateway-error';
import { BadRequestError } from './bad-request-error';
import { NotFoundError } from './not-found-error';
import { ServerError } from './server-error';
import { UnauthorizedError } from './unauthorized-error';

import { LoaderService } from '../../services/loader.service';
import { ModalLoaderService } from '../../services/modal-loader.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

  constructor(
    private loaderService: LoaderService,
    private modalLoader: ModalLoaderService,
    private notificationService: NotificationService
  ) {
    super()
  }

  handleError(error: any): void {

    this.loaderService.hideLoader();
    this.modalLoader.hideLoader();

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

    if (error instanceof AppError) {
      super.handleError(error);
      return this.notificationService.errorToast(error.originalError.error);
    }
  }
}
