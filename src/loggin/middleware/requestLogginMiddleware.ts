import { Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogginService } from '../loggin.service';

export class RequestLogginMiddleware implements NestMiddleware {
  constructor(
    @Inject(LogginService) private readonly logginService: LogginService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { requestId, ip, protocol, originalUrl, method } = req;
    const userAgent = req.get('user-agent');
    req.requestId = Date.now().toString();
    const url = `${protocol}://${req.get('Host')}${originalUrl}`;
    await this.logginService.create({
      message: 'Tratando de acceder a un recurso',
      context: 'middleware',
      level: 'info',
      userAgent: userAgent,
      requestId: requestId,
      ip: ip,
      method: method,
      url: url,
      createdAt: new Date().toISOString(),
    });
    next();
  }
}
