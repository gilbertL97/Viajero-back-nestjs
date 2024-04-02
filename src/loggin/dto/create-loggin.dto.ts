export class CreateLogginDto {
  message: string;
  context: string;
  level: string;
  userAgent: string;
  requestId: string;
  ip: string;
  method: string;
  url: string;
  userId?: number;
  createdAt: string;
}
