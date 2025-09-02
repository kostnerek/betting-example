import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface GrpcError {
  code?: number;
  message?: string;
  details?: string;
}

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let grpcCode: number;
    let message: string;

    if (exception instanceof RpcException) {
      const error = exception.getError();
      grpcCode = this.extractGrpcCode(error);
      message = this.extractMessage(error);
    } else if (this.isGrpcError(exception as Error)) {
      grpcCode = this.extractGrpcCodeFromError(exception as Error);
      message = this.extractMessageFromError(exception as Error);
    } else {
      throw exception;
    }

    const httpStatus = this.grpcToHttpStatus(grpcCode);

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
      error: this.getErrorName(httpStatus),
    });
  }

  private extractGrpcCode(error: string | object): number {
    if (typeof error === 'object' && error !== null) {
      const grpcError = error as GrpcError;
      return grpcError.code ?? 2;
    }
    return 2;
  }

  private extractMessage(error: string | object): string {
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error === 'object' && error !== null) {
      const grpcError = error as GrpcError;
      return grpcError.message ?? 'Internal server error';
    }
    return 'Internal server error';
  }

  private grpcToHttpStatus(grpcCode: number): number {
    const statusMap: Record<number, number> = {
      1: HttpStatus.INTERNAL_SERVER_ERROR, // CANCELLED
      2: HttpStatus.INTERNAL_SERVER_ERROR, // UNKNOWN
      3: HttpStatus.BAD_REQUEST, // INVALID_ARGUMENT
      4: HttpStatus.REQUEST_TIMEOUT, // DEADLINE_EXCEEDED
      5: HttpStatus.NOT_FOUND, // NOT_FOUND
      6: HttpStatus.CONFLICT, // ALREADY_EXISTS
      7: HttpStatus.FORBIDDEN, // PERMISSION_DENIED
      8: HttpStatus.TOO_MANY_REQUESTS, // RESOURCE_EXHAUSTED
      9: HttpStatus.BAD_REQUEST, // FAILED_PRECONDITION
      10: HttpStatus.CONFLICT, // ABORTED
      11: HttpStatus.BAD_REQUEST, // OUT_OF_RANGE
      12: HttpStatus.NOT_IMPLEMENTED, // UNIMPLEMENTED
      13: HttpStatus.INTERNAL_SERVER_ERROR, // INTERNAL
      14: HttpStatus.SERVICE_UNAVAILABLE, // UNAVAILABLE
      15: HttpStatus.INTERNAL_SERVER_ERROR, // DATA_LOSS
      16: HttpStatus.UNAUTHORIZED, // UNAUTHENTICATED
    };

    return statusMap[grpcCode] || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private isGrpcError(error: Error): boolean {
    return (
      'code' in error &&
      typeof error.code === 'number' &&
      error.code >= 0 &&
      error.code <= 16
    );
  }

  private extractGrpcCodeFromError(error: Error): number {
    if ('code' in error && typeof error.code === 'number') {
      return error.code;
    }
    return 2; // UNKNOWN
  }

  private extractMessageFromError(error: Error): string {
    if ('details' in error && typeof error.details === 'string') {
      return error.details;
    }
    return error.message || 'Internal server error';
  }

  private getErrorName(httpStatus: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      501: 'Not Implemented',
      503: 'Service Unavailable',
    };

    return errorNames[httpStatus] ?? 'Unknown Error';
  }
}
