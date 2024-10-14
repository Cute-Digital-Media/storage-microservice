import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const GetTokenUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // TODO: abstract this logic away 
    // const req = ctx.switchToHttp().getRequest();
    // const tokenUser = req.tokenUser;

    // if (tokenUser)
    //   return (!data) ? tokenUser : tokenUser[data];
    return "user_uuid"
    },
);
