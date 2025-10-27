import { Request } from 'express';
import { User } from './User';

export interface IAuthenticatedRequest extends Request {
  user?: User;
  message?: string;
}
