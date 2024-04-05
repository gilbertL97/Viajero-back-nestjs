import { Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogginService } from '../loggin.service';

export class RequestLogginMiddleware implements NestMiddleware {
  constructor(
    @Inject(LogginService) private readonly logginService: LogginService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.logginService.create({
      message: 'Tratando de acceder a un recurso',
      context: 'middleware',
      level: 'info',
      createdAt: new Date().toISOString(),
    });
    next();
  }
}
