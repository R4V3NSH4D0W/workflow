import "server-only";
import { getCookie } from "hono/cookie";
import {createMiddleware} from"hono/factory";
import {Client,Account,Databases,Models,Storage, type Account as AcccountType, type Databases as DatabasesType,type Storage as StroageType, type Users as UsersType} from "node-appwrite";
import { AUTH_COOKIE } from "@/features/auth/constants";

type AdditionalContext={
    Variables:{
        account:AcccountType;
        databases:DatabasesType;
        storage:StroageType;
        users:UsersType;
        user: Models.User<Models.Preferences>;
    };
}

export const sessionMiddleWare=createMiddleware<AdditionalContext>(
    async(c,next)=>{
        const clinet = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APP_WRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APP_WRITE_PROJECT!);

        const session = getCookie(c,AUTH_COOKIE);
        if(!session){
            return c.json({error:"UnAuthorized"},401);
        }
        clinet.setSession(session);
        const account = new Account(clinet);
        const databases = new Databases(clinet);
        const storage = new Storage(clinet);
        const user = await account.get();

        c.set("account",account);
        c.set("databases",databases);
        c.set("storage",storage);
        c.set("user",user);

        await next();
    },
);