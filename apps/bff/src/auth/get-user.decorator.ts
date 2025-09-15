import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): CreateUserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
