import { RpcException } from '@nestjs/microservices';
import { GRPC_STATUS, GrpcStatusCode } from '../constants/grpc-status';

/**
 * Creates a standardized gRPC exception
 */
export function createGrpcError(
  code: GrpcStatusCode,
  message: string,
): RpcException {
  return new RpcException({
    code,
    message,
  });
}

/**
 * Common gRPC error creators
 */
export const GrpcErrors = {
  notFound: (resource: string) =>
    createGrpcError(GRPC_STATUS.NOT_FOUND, `${resource} not found`),

  alreadyExists: (resource: string) =>
    createGrpcError(GRPC_STATUS.ALREADY_EXISTS, `${resource} already exists`),

  invalidArgument: (message: string) =>
    createGrpcError(GRPC_STATUS.INVALID_ARGUMENT, message),

  unauthenticated: (message = 'Authentication required') =>
    createGrpcError(GRPC_STATUS.UNAUTHENTICATED, message),

  permissionDenied: (message = 'Permission denied') =>
    createGrpcError(GRPC_STATUS.PERMISSION_DENIED, message),

  internal: (message = 'Internal server error') =>
    createGrpcError(GRPC_STATUS.INTERNAL, message),
};
