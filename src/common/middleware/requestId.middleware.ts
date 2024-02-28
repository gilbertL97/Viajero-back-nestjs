// request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    req.requestId = Date.now().toString();
    const { requestId, ip, protocol, originalUrl, method } = req;
    const user = req.user;
    console.log(req.get('user-agent'), req.user);
    console.log(`${protocol}://${req.get('Host')}${originalUrl}`); // Genera un ID único para la petición
    next();
  }
}
