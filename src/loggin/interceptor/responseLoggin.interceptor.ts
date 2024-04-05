import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LogginService } from '../loggin.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class LogginResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(LogginService) private readonly logginService: LogginService,
  ) {} //...
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log(err.stack);
        return throwError(err);
      }),
    );
  }
}
