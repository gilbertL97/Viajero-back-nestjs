// request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';
import { StoreModel } from '../model/Store.model';
import { extract_user_data, jwtDecode } from 'src/common/utils/jwt/util.jwt';

@Injectable()
export class storeData implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<StoreModel>) {}
  use(req: Request, res: Response, next: NextFunction): void {
    req.requestId = Date.now().toString();
    const { requestId, ip, protocol, originalUrl, method } = req;
    const userAgent = req.get('user-agent');
    const url = `${protocol}://${req.get('Host')}${originalUrl}`;
    const token = req.get('Authorization')?.replace('Bearer ', '');
    if (token) console.log(jwtDecode(token));
    const store: StoreModel = {
      userAgent,
      requestId,
      ip,
      method,
      url,
    };
    this.als.run(store, () => {
      next();
    });
  }
}
