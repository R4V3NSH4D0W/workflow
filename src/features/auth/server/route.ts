import { Hono } from "hono";
import {zValidator} from "@hono/zod-validator";
import { LoginSchema, RegisterSchema } from "@/features/auth/schemas";
import { createAdminClinet } from "@/lib/app-write";
import { ID } from "node-appwrite";
import {deleteCookie, setCookie} from"hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleWare } from "@/lib/session-middleware";

const app = new Hono()
.get("/current",
    sessionMiddleWare,
    (c)=>{
    const user = c.get("user");

    return c.json({data:user});
})
 .post("/login",
    zValidator("json",LoginSchema
),async(c)=>{
    const {email, password}= c.req.valid("json");
    const {account}= await createAdminClinet();
    const session = await account.createEmailPasswordSession(
        email,password
    )
    setCookie(c,AUTH_COOKIE,session.secret,{
        path:'/',
        httpOnly:true,
        sameSite:"strict",
        maxAge:60* 60* 24 * 30,
    });

    return c.json({sucess:true});
}).post("/register",
    zValidator("json",RegisterSchema),
    async(c)=>{
    const {name,email, password}= c.req.valid("json");
    const {account}= await createAdminClinet();
    await account.create(
        ID.unique(),
        email,
        password,
        name
    )
    const session = await account.createEmailPasswordSession(
        email,password
    )
    setCookie(c,AUTH_COOKIE,session.secret,{
        path:'/',
        httpOnly:true,
        sameSite:"strict",
        maxAge:60* 60* 24 * 30,
    });

    return c.json({sucess:true});
}).post("/logout",
    sessionMiddleWare,
    async(c)=>{
    const account = c.get("account");
    deleteCookie(c,AUTH_COOKIE);
    await account.deleteSession("current");
    
    return c.json({sucess:true});
})
export default app;