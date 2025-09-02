import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

/**
 * Creates a standardized gRPC exception
 */
export function createGrpcError(code: status, message: string): RpcException {
  console.log('Throwing RPC error');
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
    createGrpcError(status.NOT_FOUND, `${resource} not found`),

  alreadyExists: (resource: string) =>
    createGrpcError(status.ALREADY_EXISTS, `${resource} already exists`),

  invalidArgument: (message: string) =>
    createGrpcError(status.INVALID_ARGUMENT, message),

  unauthenticated: (message = 'Authentication required') =>
    createGrpcError(status.UNAUTHENTICATED, message),

  permissionDenied: (message = 'Permission denied') =>
    createGrpcError(status.PERMISSION_DENIED, message),

  internal: (message = 'Internal server error') =>
    createGrpcError(status.INTERNAL, message),
};
