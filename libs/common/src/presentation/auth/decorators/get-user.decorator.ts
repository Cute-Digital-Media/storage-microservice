import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetTokenUser = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    
    // const req = ctx.switchToHttp().getRequest();
    // const tokenUser: JwtPayload = req. ;

    // if (tokenUser)
    //   return (!data) ? tokenUser : tokenUser[data];

    return "670d1451-5974-8002-9288-aa476cb08e01";
  }
);
