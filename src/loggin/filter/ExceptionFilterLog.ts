// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogginService } from '../loggin.service';

@Catch(HttpException)
export class HttpExceptionFilterLog implements ExceptionFilter {
  constructor(private readonly logsService: LogginService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseException = exception.getResponse();
    const messageException =
      typeof responseException == 'object'
        ? 'message' in responseException && responseException.message
        : responseException;

    // Guardar el error en el sistema de logs
    this.logsService.create({
      message: `${exception.message}:${messageException}`,
      context: 'http-exception.filter',
      level: 'error',
      createdAt: new Date().toISOString(),
      errorStack: exception.stack,
    });
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: messageException,
    });
  }
}
