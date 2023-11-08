import {
  ArgumentsHost,
  Catch,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GenericException, InvalidCredentials, ValidationFailed } from '.';
import { Unauthorized } from './Unauthorized';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<any> {
    return [
      NotFoundException,
      ValidationFailed,
      InvalidCredentials,
      GenericException,
      Unauthorized,
      UnauthorizedException,
    ];
  }

  catch(exception: any, host: ArgumentsHost) {
    if (
      !this.doNotReport()
        .map((e) => e?.name)
        .includes(exception?.constructor?.name)
    ) {
      console.error('ERRRR ==> ', exception);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    if (exception instanceof ValidationFailed) {
      return response.status(exception.getStatus).json({
        isSuccess: false,
        message: exception.message,
        data: null,
      });
      // return response.error(
      //   {
      //     message: exception.message,
      //     errors: exception.getErrors(),
      //   },
      //   exception.getStatus(),
      // );
    }

    let message =
      exception.message || 'Something went wrong. Please try again later';

    const status = exception.status ? exception.status : 500;
    message = exception.status ? message : 'Internal Server Error';

    // return response.status(status).json({
    //   success: false,
    //   code: status,
    //   message,
    // });
    return response.status(status).json({
      isSuccess: false,
      message,
      data: null,
    });
  }
}
