import { Request } from 'express';
import { IGoogleUser } from './GoogleUser';

export interface IAuthenticatedRequest extends Request {
  user?: IGoogleUser;
  message?: string;
}
