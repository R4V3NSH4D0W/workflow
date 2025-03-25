import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGE_BUCKET_ID, MEMBERS_ID, TASK_ID, WORKSPACE_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
.get("/",sessionMiddleWare,async(c)=>{
    const databases= c.get("databases");
    const user= c.get("user");

    const members =await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("userId",user.$id)]
    )
    if(members.total ===0){
        return c.json({data:{
            documents:[],
            total:0
        }})
    }

    const workspacesIds = members.documents.map((member)=>member.workspaceId);

    const workspaces = await databases.listDocuments(
        DATABASE_ID,WORKSPACE_ID,[Query.orderDesc("$createdAt"),
            Query.contains("$id",workspacesIds)]
    );
    return c.json({data:workspaces})
})
.post("/", zValidator("form",createWorkspaceSchema),
sessionMiddleWare,
async(c)=>{
    const databases =c.get("databases");
    const user = c.get("user");
    const storage= c.get("storage");

    const {name,image}=c.req.valid("form");

    let uploadedImageUrl:string|undefined;

    if(image instanceof File){
        const file =await storage.createFile(IMAGE_BUCKET_ID,ID.unique(),image);

        const arrayBuffer= await storage.getFilePreview(IMAGE_BUCKET_ID,file.$id);

        uploadedImageUrl=`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),{
            name,
            userid:user.$id,
            imageUrl:uploadedImageUrl,
            inviteCode: generateInviteCode(10),

        }
    );
    await databases.createDocument(DATABASE_ID,MEMBERS_ID,ID.unique(),{
        userId:user.$id,
        workspaceId: workspace.$id,
        role:MemberRole.ADMIN
    });
    return c.json({data:workspace})
})
.patch("/:workspaceId",
    sessionMiddleWare,zValidator("form",updateWorkspaceSchema),
    async(c)=>{

        const databases= c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const {workspaceId}= c.req.param();
        const {name,image}=c.req.valid("form");

        const member = await getMember({databases,workspaceId,userId:user.$id});
        if(!member || member.role !== MemberRole.ADMIN){
            return c.json({error:"unAuthorized"},401)
        }

        let uploadedImageUrl:string|undefined;

        if(image instanceof File){
            const file =await storage.createFile(IMAGE_BUCKET_ID,ID.unique(),image);
    
            const arrayBuffer= await storage.getFilePreview(IMAGE_BUCKET_ID,file.$id);
    
            uploadedImageUrl=`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
        }else{
            uploadedImageUrl= image;
        }
        const workspace = await databases.updateDocument(
            DATABASE_ID,WORKSPACE_ID,workspaceId,{
                name,
                imageUrl:uploadedImageUrl,
            }
        ) 
        
        return c.json({data:workspace});
    }
)

//TODO: Delete members, projects and tasks
.delete("/:workspaceId",
    sessionMiddleWare,
    async(c)=>{
        const databases = c.get("databases");
        const user= c.get("user");
        const {workspaceId}= c.req.param();
        const member=  await getMember({
            databases,workspaceId,userId:user.$id
        });
        if(!member || member.role !== MemberRole.ADMIN){
            return c.json({
                error:"unAuthorized"
            },401)
        }
        await databases.deleteDocument(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId
        )
        return c.json({data:{
            $id:workspaceId
        }})
    }
)
.post("/:workspaceId/reset-invite-code",
    sessionMiddleWare,
    async(c)=>{
        const databases = c.get("databases");
        const user= c.get("user");
        const {workspaceId}= c.req.param();
        const member=  await getMember({
            databases,workspaceId,userId:user.$id
        });
        if(!member || member.role !== MemberRole.ADMIN){
            return c.json({
                error:"unAuthorized"
            },401)
        }
      const workspace=  await databases.updateDocument(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,{
                inviteCode:generateInviteCode(10),
            }
        )
        return c.json({data:workspace})
    }
)
.post("/:workspaceId/join",
    sessionMiddleWare,
    zValidator("json",z.object({
        code:z.string()
    })),async(c)=>{
        const {workspaceId}= c.req.param();
        const {code}=c.req.valid("json");
        const databases = c.get("databases");
        const user= c.get("user");
        const member = await getMember({
            databases,
            workspaceId,
            userId:user.$id,
        })

        if(member){
            return c.json({error:"Already a member"},400);
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        )

        if(workspace.inviteCode !== code){
            return c.json({error:"Invalid invite code"},400)
        }

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                workspaceId,
                userId:user.$id,
                role:MemberRole.MEMBER,
            }
        )

        return c.json({data:workspace})
    }
)
.get("/:workspaceId",
    sessionMiddleWare,
    async(c)=>{
        const {workspaceId}= c.req.param();
        const databases = c.get("databases");
        const user= c.get("user");

        const member = await getMember({
            databases,
            workspaceId,
            userId:user.$id,
        })

        if(!member){
            return c.json({error:"unAuthorized"},401);
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        )

        return c.json({data:workspace});
    }
)
.get("/:workspaceId/info",
    sessionMiddleWare,
    async(c)=>{
        const {workspaceId}= c.req.param();
        const databases = c.get("databases");

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        )

        return c.json({
            data:
            {$id: workspace.$id,
            name:workspace.name, 
            imageUrl:workspace.imageUrl
            }});
    }
)
.get("/:workspaceId/analytics",
    sessionMiddleWare,
    async(c) => {
        try {
            const databases = c.get("databases");
            const user = c.get("user");
            const { workspaceId } = c.req.param();

        
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const now = new Date();
            const thisMonthStart = startOfMonth(now);
            const thisMonthEnd = endOfMonth(now);
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const lastMonthEnd = endOfMonth(subMonths(now, 1));

            const [
                thisMonthTasks,
                lastMonthTasks,
                thisMonthAssignedTasks,
                lastMonthAssignedTasks,
                thisMonthIncompleteTasks,
                lastMonthIncompleteTasks,
                thisMonthCompletedTasks,
                lastMonthCompletedTasks,
                thisMonthOverdueTasks,
                lastMonthOverdueTasks
            ] = await Promise.all([
                // Total tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Assigned tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.equal("assigneeId", member.$id),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.equal("assigneeId", member.$id),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Incomplete tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Completed tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.equal("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.equal("status", TaskStatus.DONE),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ]),

                // Overdue tasks
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.lessThan("dueDate", now.toISOString()),
                    Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
                ]),
                databases.listDocuments(DATABASE_ID, TASK_ID, [
                    Query.equal("workspaceId", workspaceId),
                    Query.notEqual("status", TaskStatus.DONE),
                    Query.lessThan("dueDate", now.toISOString()),
                    Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                    Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
                ])
            ]);

            // Calculate metrics with null checks
            const calculateDifference = (current: number, previous: number) => ({
                count: current,
                difference: current - previous
            });

            return c.json({
                data: {
                    tasks: calculateDifference(thisMonthTasks.total, lastMonthTasks.total),
                    assignedTasks: calculateDifference(
                        thisMonthAssignedTasks.total,
                        lastMonthAssignedTasks.total
                    ),
                    completedTasks: calculateDifference(
                        thisMonthCompletedTasks.total,
                        lastMonthCompletedTasks.total
                    ),
                    incompleteTasks: calculateDifference(
                        thisMonthIncompleteTasks.total,
                        lastMonthIncompleteTasks.total
                    ),
                    overdueTasks: calculateDifference(
                        thisMonthOverdueTasks.total,
                        lastMonthOverdueTasks.total
                    )
                }
            });

        } catch (error) {
            console.error("Analytics error:", error);
            return c.json({ error: "Failed to fetch analytics" }, 500);
        }
    }
)

export default app;