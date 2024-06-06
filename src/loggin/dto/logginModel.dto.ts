export class LogginModel {
  message: string;
  context: string;
  level: string;
  userId?: number;
  createdAt: string;
  errorStack?: string;
}
export class Logs {
  message: string;
  context: string;
  level: string;
  userId: number;
  createdAt: string;
  errorStack: string;
  userAgent: string;
  requestId: string;
  ip: string;
  method: string;
  url: string;
}
