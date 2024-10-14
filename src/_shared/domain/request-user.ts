import { Request } from 'express';

export class Payload {
  userId: number;
  tenantId: string;
}


export class RequestUser extends Request {
  user: Payload;
}